//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import Dropdown from 'react-toolbox/lib/dropdown'
// import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import axios from 'axios'
import { Dialog } from 'react-toolbox/lib/dialog'
import { action, observable, computed } from 'mobx'

//STYLES
import styles from './css/forgot-password.scss'

//THEME
import theme from '../../assets/css/theme.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { user, snackbar, appStack, overlayLoading, countdownTimer, tokens } from '../../services/stores'


//CONFIG
import { getIAMEndpoint } from '../../config'

//INNER CONFIG
let countryCodes = [
  { value: '886', label: '+886' },
  { value: '852', label: '+852' },
  { value: '62', label: '+62' }
]

@observer
class ForgotPassword extends Component {
  constructor() {
    super()
    this.id = appStack.push()
    this.state = {
      countryCode: '886',
      telp: '',
      otp: '',
      otp_error: '',
      modalActive: false
    }
  }
  MINUTES_COUNTDOWN = 3
  SECONDS_COUNTDOWN = 30
  
  

  componentWillUnmount() {
    appStack.pop()
    this.isUnmounted = true
    
  }


  componentDidMount() {
    let { setTitle } = this.props
    setTitle('Lupa Password')
    countdownTimer.history = this.props.history
  }

  isUnmounted = false
  DEFAULT_COUNT = 120

  @observable count = this.DEFAULT_COUNT
  @observable secret = ''



  @observable otpModalActive = false
  @observable otpConfirmationActions = [
    {
      label: 'Kirim Ulang', onClick: () => {
        this.toggleActive()
      },
      disabled: false
    },
    {
      label: 'Konfirmasi', onClick: () => {
        this.toggleActive()
      }
    },
  ]

  @computed
  get mssidn() {
    let { countryCode, telp } = this.state
    return `${countryCode}${telp}`
  }

  showConfirmationModal = () => {
    this.otpModalActive = true
  }

  toggleConfirmationModal = () => {
    this.otpModalActive = !this.otpModalActive
  }

  onResendClicked = () => {
    this.sendOTP()
  }



  onConfirmClicked = async () => {
    let response = await user.confirmOTP(this.mssidn, this.state.otp, this.secret)
    if (!response.is_ok) {
      this.setState({ otp_error: 'Kode konfirmasi OTP tidak valid' })
      return snackbar.show('Kode konfirmasi OTP tidak valid')
    }
    await user.setMsisdn(this.mssidn)
    await tokens.setForgotPasswordToken(response.validToken)
    this.props.history.push('/auth/forgot/new')
  }

  handleChange(name, value) {
    if (name === 'telp') {
      if (value[0] === '0') { //if the first value is 0
        value = value.split('').slice(1).join('')
      }
    }
    this.setState(...this.state, { [name]: value, [`${name}_error`]: '' })
  }

  @action
  resetCount = () => {
    this.count = this.DEFAULT_COUNT
  }

  onSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()  
    countdownTimer.min_countdown = this.MINUTES_COUNTDOWN
    countdownTimer.sec_countdown = this.SECONDS_COUNTDOWN
    let numberExist = await this.isNumberExist()
    if (!numberExist) 
    return snackbar.show('Nomor tidak ditemukan pada Database. Silakan ulangi kembali')
    
    await this.sendOTP()
    
    //set countdown
    countdownTimer.setCountdownTimer()
    this.showConfirmationModal()
  }

  isNumberExist = async () => {
    overlayLoading.show()
    try {
      let { data: { is_ok } } = await axios.post(getIAMEndpoint(`/quick/${this.mssidn}`))
      overlayLoading.hide()
      return is_ok
    } catch (e) {
      overlayLoading.hide()
      snackbar.show('Terjadi kesalahan koneksi. Silakan ulangi kembali nanti')
      throw e
    }
  }

  intervalId = null

  @action
  sendOTP = async () => {
    this.resetCount()
    let { data } = await user.sendOTP(this.mssidn)

    let { is_ok, data: secret } = data
    if (!is_ok) return snackbar.show('Gagal mengirimkan Kode OTP')

    this.secret = secret
    //invoke decreaseCount method every 1 second
    this.intervalId = setInterval(() => {
      if (!this.isUnmounted) {
        this.decreaseCount()
      }
    }, 1000)
  }

  @computed
  get canResend() {
    return this.count <= 0
  }

  @action
  decreaseCount = () => {
    if (this.canResend) {
      this.otpConfirmationActions = observable([
        {
          label: 'Kirim Ulang', onClick: this.onResendClicked,
          disabled: false
        },
        {
          label: 'Konfirmasi', onClick: this.onConfirmClicked
        }
      ])

      if (this.intervalId !== null) clearInterval(this.intervalId)
      this.intervalId = null

      return
    }

    this.otpConfirmationActions = observable([
      {
        label: `Kirim Ulang (${--this.count})`, onClick: this.onResendClicked,
        disabled: true
      },
      {
        label: 'Konfirmasi', onClick: this.onConfirmClicked
      }
    ])
  }

  renderButton = () => {
    if (user.isLoadingUpdateProfile || user.isLoadingSendingOTP) return (
      <div className={styles['loading-wrapper']} >
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    )
    return <PrimaryButton type="submit">Lanjut</PrimaryButton>
  }

  render() {
    return (
      <div className={styles['container']}>
        <div className={styles.top}>
          <div className={styles.pageTitle}>
            Blanja
          </div>
          <div className={styles.desc}>
            Masukkan nomor telepon Anda untuk menerima kode melalui SMS
          </div>
        </div>
        <form className={styles.form} onSubmit={this.onSubmit}>
          <div className={styles.tel}>
            <Dropdown
              auto={false}
              source={countryCodes}
              onChange={this.handleChange.bind(this, 'countryCode')}
              label="Kode Negara"
              value={this.state.countryCode}
              className={styles.country_code}
              required
            />
            <Input
              type="tel"
              label="Nomor Telepon"
              required
              onChange={this.handleChange.bind(this, 'telp')}
              value={this.state.telp}
              required
            />
          </div>

          {this.renderButton()}

          <Dialog
            actions={!user.isLoadingSendingOTP ? this.otpConfirmationActions.slice() : []}
            active={this.otpModalActive}
            title='Konfirmasi OTP'
          >

            {
              user.isLoadingSendingOTP ?
                (
                  <div className={styles['loading-wrapper']} >
                    <ProgressBar
                      className={styles.loading}
                      type='circular'
                      mode='indeterminate' theme={ProgressBarTheme}
                    />
                  </div>
                ) :
                (
                  <div className={styles.modal} >
                    <p className={styles.time}>
                      {countdownTimer.min_countdown + ':' + (countdownTimer.sec_countdown < 10 ? '0' : '') + countdownTimer.sec_countdown}
                    </p>
                    <Input
                      name="otp"
                      type="text"
                      label="Nomor OTP"
                      onChange={this.handleChange.bind(this, 'otp')}
                      value={this.state.otp}
                      theme={theme}
                      error={this.state.otp_error}
                    />
                  </div>
                )
            }

          </Dialog>

        </form>
      </div>


    )
  }
}

export default ForgotPassword
//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import { observable, computed, action } from 'mobx'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import Dialog from 'react-toolbox/lib/dialog'
import axios from 'axios'

//STYLES 
import styles from './css/register.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//THEME
import theme from '../../assets/css/theme.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//INNER_CONFIG
let countryCodes = [
  { value: '886', label: '+886' },
  { value: '852', label: '+852' },
  { value: '62', label: '+62' },
]

//STORE
import { user, appStack, snackbar, overlayLoading } from '../../services/stores'
import { getIAMEndpoint } from '../../config'

//COMPONENT
@observer
class Register extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
    this.isUnmounted = true
  }

  componentDidMount() {
    this.props.setTitle('Daftar')
  }

  isUnmounted = false
  DEFAULT_COUNT = 120

  state = {
    countryCode: '886',
    telp: '',
    password: '',
    address: '',
    name: '',
    gender: '',
    otp: '',
    otp_error: ''
  }

  @observable otpModalActive = false
  @observable otpConfirmationActions = [
    {
      label: 'Kirim Ulang', onClick: this.toggleActiveConfirmationModal,
      disabled: false
    },
    {
      label: 'Konfirmasi', onClick: this.toggleActiveConfirmationModal
    }
  ]
  @observable count = this.DEFAULT_COUNT
  @observable secret = ''
  
  @computed
  get msisdn() {
    let { countryCode, telp } = this.state
    return `${countryCode}${telp}`
  }

  @computed
  get canResend() {
    return this.count <= 0
  }

  @action
  decreaseCount() {
    if (this.canResend) {
      this.otpConfirmationActions = observable([
        {
          label: 'Kirim Ulang', onClick: this.onResendClicked,
          disabled: false
        },
        {
          label: 'Konfirmasi', onClick: this.onConfirmClicked
        },
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
      },
    ])
  }

  onResendClicked = () => {
    this.sendOtp()
  }

  onConfirmClicked = async () => {
    let { is_ok, validToken } = await user.confirmOTP(this.msisdn, this.state.otp, this.secret)

    if (!is_ok) {
      this.setState({otp_error: 'Kode konfirmasi tidak valid'})
      return snackbar.show('Kode konfirmasi tidak valid')
    }
    
    this.register(validToken)
  }

  @action
  resetCount() {
    this.count = this.DEFAULT_COUNT
  }

  @action
  showConfirmationModal() {
    this.otpModalActive = true
  }

  toggleActiveConfirmationModal = () => {
    this.otpModalActive = !this.otpModalActive
  }

  handleChange(name, value) {
    if (name === 'telp')
      if (value[0] === '0')
        value = value.split('').slice(1).join('')

    this.setState({ [name]: value, [`${name}_error`]: '' })
  }

  isUserExist = async () => {
    overlayLoading.show()
    try {
      let { data: { is_ok } } = await axios.post(getIAMEndpoint(`/quick/${this.msisdn}`))
      overlayLoading.hide()
      if (is_ok)
        snackbar.show('Nomor telah terdaftar. Silahkan gunakan fitur lupa password')
      return is_ok
    } catch(e) {
      overlayLoading.hide()
      snackbar.show('Telah terjadi kesalahan koneksi, coba lagi nanti')
      throw e
    }
  }

  onSubmit = async e => {
    e.preventDefault()
    e.stopPropagation()

    let isUserExist = await this.isUserExist()
    if (isUserExist) return
    console.log('sending otp')
    await this.sendOtp()
    this.showConfirmationModal()
  }

  intervalId = null

  @action
  async sendOtp() {
    this.resetCount()
    let { data } = await user.sendOTP(this.msisdn)

    if (!data) return
    let { is_ok, data: secret } = data

    if (!is_ok) return snackbar.show('Gagal mengirimkan kode OTP')

    this.secret = secret

    this.intervalId = setInterval(() => {
      if (!this.isUnmounted) {
        this.decreaseCount()
      }
    }, 1000)
  }

  register(transactionId) {
    let {
      countryCode,
      password,
      address,
      name,
    } = this.state

    let { msisdn } = this
    
    user.register({
      transactionId,
      name,
      msisdn,
      password,
      address,
      country: countryCode === '886' ? 'TWN' : countryCode === '852' ? 'HKG' : 'IDN'
    }).then(token => {
      if (!token) snackbar.show('Registrasi gagal!')
    })
  }

  renderButton() {
    if (user.isLoadingUpdateProfile || user.isLoadingSendingOTP) return (
      <div className={styles['loading-wrapper']} >
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    )

    return <PrimaryButton type="submit" >Daftar</PrimaryButton>
  }

  render() {
    return (
      <div className={styles.container} >
        <div className={styles.top} >
          <div className={styles.title} ><span>Jualbli</span></div>
          <div className={styles.desc} ><span>
            Masukkan data diri anda untuk menjadi anggota Jualbli
          </span></div>
        </div>

        <form className={styles.form} onSubmit={this.onSubmit} >
          <Input
            name="name"
            type="text"
            label="Nama"
            onChange={this.handleChange.bind(this, 'name')}
            value={this.state.name}
            theme={theme}
            required
          />

          <div className={styles.handphone} >
            <Dropdown
              auto
              className="country_code"
              onChange={this.handleChange.bind(this, 'countryCode')}
              source={countryCodes}
              value={this.state.countryCode}
              label="Kode Negara"
              required
            />

            <div className={styles.telp} >
              <Input
                name="phone_number"
                type="tel"
                label="Nomor Telepon"
                onChange={this.handleChange.bind(this, 'telp')}
                value={this.state.telp}
                theme={theme}
                required
              />
            </div>
          </div>

          <Input
            name="password"
            type="password"
            label="Password"
            onChange={this.handleChange.bind(this, 'password')}
            value={this.state.password}
            theme={theme}
            required
          />

          <Input
            name="address"
            type="text"
            label="Alamat"
            onChange={this.handleChange.bind(this, 'address')}
            value={this.state.address}
            theme={theme}
            multiline
            rows={2}
          />

          {this.renderButton()}

          <span className={styles.ref} >
            Sudah memiliki akun? <Link to="/auth/login" >Login disini</Link>
          </span>

          <Dialog
            actions={
              !user.isLoadingSendingOTP
                ? this.otpConfirmationActions.slice()
                : []
            }
            active={this.otpModalActive}
            title="Konfirmasi OTP"
          >
            {
              user.isLoadingSendingOTP
                ? (
                  <div className={styles['loading-wrapper']} >
                    <ProgressBar
                      className={styles.loading}
                      type='circular'
                      mode='indeterminate' theme={ProgressBarTheme}
                    />
                  </div>
                )
                : (
                  <div className={styles.modal} >
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

export default Register
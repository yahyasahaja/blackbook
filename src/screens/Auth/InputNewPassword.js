//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'



//STYLES
import styles from './css/new-passowrd.scss'

//THEME
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { user, snackbar, appStack, overlayLoading, countdownTimer, tokens } from '../../services/stores'

//CONFIG
import { observable } from 'mobx'

@observer
class NewPassword extends Component {
  constructor() {
    super()
    this.id = appStack.push()
    this.state = {
      password: '',
      confirmPassword: '',
    }
  }

  @observable validToken

  componentWillUnmount() {
    appStack.pop()
    this.isUnmounted = true
    clearInterval(countdownTimer.countdownIntervalId)
  }

  isUnmounted = false

  componentDidMount() {
    let { setTitle } = this.props
    setTitle('Lupa Password')
    console.log(user.msisdn)
    console.log(tokens.forgotPasswordToken)
    countdownTimer.history = this.props.history
  }

  handleChange(name, value) {
    this.setState(...this.state, { [name]: value })
  }

  onSubmit = async (e) =>{
    e.preventDefault()
    e.stopPropagation()

    if(this.state.confirmPassword !== this.state.password){
      snackbar.show('Password Baru dan Konfirmasi Password yang dimasukkan harus sama')
      this.setState(...this.state, { confirmPassword: '', password: '' })
    } else {
      console.log('success reach else conditional')
      let data = await this.forgotPassword()
      console.log('has been succeeded from forgotPassword')
      if(data.is_ok) {
        console.log('gonna out from here')
        this.props.history.push('/auth/login')
      } else{
        console.log('failed to go out')
      }
        
    }
  }

  forgotPassword = async () =>{
    console.log('success invoke forgotPassword')
    overlayLoading.show()
    try{
      console.log('success reach try')
      console.log(this.state.confirmPassword)
      console.log(typeof this.state.confirmPassword)
      console.log(user.msisdn)
      console.log(typeof user.msisdn)
      console.log(tokens.forgotPasswordToken)
      console.log(typeof tokens.forgotPasswordToken)
      let data = await user.forgotPassword(
        this.state.confirmPassword, 
        user.msisdn, 
        tokens.forgotPasswordToken)
      overlayLoading.hide()
      console.log('success called forgotPassword api')
      if(data.is_ok){
        console.log('response is_ok')
        snackbar.show('Password anda berhasil diganti')
      } else{
        console.log('response is failed ' + data.error)
      }
      return data
    } catch(e){
      overlayLoading.hide()
      snackbar.show('Terjadi kesalahan koneksi. Silahkan coba kembali')
      throw e
    }
  }

  renderButton = () => {
    if(user.isLoadingChangePassword)
      return (
        <div className={styles['loading-wrapper']} >
          <ProgressBar
            className={styles.loading}
            type='circular'
            mode='indeterminate' theme={ProgressBarTheme}
          />
        </div>
      )
    return <PrimaryButton type="submit">Ganti Password</PrimaryButton>
  }
  
  render() {
    return (
      <div className={styles['container']}>
        <div className={styles.top}>
          <div className={styles.pageTitle}>
            Jualbli
          </div>
          <div className={styles.desc}>
            Masukkan password baru Anda untuk mengganti password
          </div>
        </div>
        <div className={styles.timer}>
          {(countdownTimer.min_countdown === undefined 
            ? 
            '' 
            : 
            countdownTimer.min_countdown) 
          + 
            (countdownTimer.min_countdown === undefined && 
            countdownTimer.sec_countdown === undefined 
              ? 
              '' 
              : 
              ':')
            + (countdownTimer.sec_countdown === undefined 
              ? 
              '' 
              : 
              countdownTimer.sec_countdown < 10 ? '0' : '') 
          + (countdownTimer.sec_countdown === undefined
            ?
            ''
            :
            countdownTimer.sec_countdown)}
        </div>
        <form className={styles.form} onSubmit={this.onSubmit}>
          <div className={styles.password}>
            <Input
              type="password"
              label="Password Baru"
              data-testid="password"
              required
              onChange={this.handleChange.bind(this, 'password')}
              value={this.state.password}
            />
            <Input
              type="password"
              data-testid="retype-password"
              label="Konfirmasi Password"
              required
              onChange={this.handleChange.bind(this, 'confirmPassword')}
              value={this.state.confirmPassword}
            />
            {this.state.password !== this.state.confirmPassword ? <span className={styles.checkPassword}>Password harus sama</span> : ''}
          </div>
          {this.renderButton()}
        </form>
      </div>
    )
  }
}

export default NewPassword
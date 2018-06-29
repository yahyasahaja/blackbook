//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/new-passowrd.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { user, snackbar, appStack, overlayLoading, countdownTimer, tokens } from '../../services/stores'

//CONFIG
import { observable, computed, action } from 'mobx'

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
  }

  isUnmounted = false

  componentDidMount() {
    let { setTitle } = this.props
    setTitle('Lupa Password')
    countdownTimer.setCountdownTimer()
    console.log(user.msisdn)
  }

  handleChange(name, value) {
    this.setState(...this.state, { [name]: value })
  }

  // onSubmit = async (e) =>{
  //   e.preventDefault()
  //   e.stopPropagation()

  //   if(this.state.confirmPassword !== this.state.password){
  //     snackbar.show('Password Baru dan Konfirmasi Password yang dimasukkan harus sama')
  //     this.setState(...this.state, { confirmPassword: '', password: '' })
  //   } else{
      
  //   }
  // }

  // forgotPassword = async () =>{
  //   overlayLoading.show()
  //   try{
  //     let res = await user.forgotPassword(this.state.confirmPassword)
  //   } catch(e){
  //     overlayLoading.hide()
  //     snackbar.show('Terjadi kesalahan koneksi. Silahkan coba kembali')
  //     throw e
  //   }
  // }
  
  render() {
    return (
      <div className={styles['container']}>
        <div className={styles.top}>
          <div className={styles.pageTitle}>
            Blanja
          </div>
          <div className={styles.desc}>
            Masukkan password baru Anda untuk mengganti password
          </div>
        </div>
        <div className={styles.timer}>
          {countdownTimer.min_countdown + ' : ' + (countdownTimer.sec_countdown < 10 ? '0' : '') + countdownTimer.sec_countdown}
        </div>
        <form className={styles.form} onSubmit={this.onSubmit}>
          <div className={styles.password}>
            <Input
              type="password"
              label="Password Baru"
              required
              onChange={this.handleChange.bind(this, 'password')}
              value={this.state.password}
            />
            <Input
              type="password"
              label="Konfirmasi Password"
              required
              onChange={this.handleChange.bind(this, 'confirmPassword')}
              value={this.state.confirmPassword}
            />
            {this.state.password !== this.state.confirmPassword ? <span className={styles.checkPassword}>Password harus sama</span> : ''}
          </div>
          <PrimaryButton type="submit">Ganti Password</PrimaryButton>
        </form>
      </div>
    )
  }
}

export default NewPassword
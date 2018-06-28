//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/new-passowrd.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { appStack, snackbar } from '../../services/stores'

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
      error_password: ''
    }
  }

  @observable secret = ''


  componentWillUnmount() {
    appStack.pop()
    this.isUnmounted = true
  }

  isUnmounted = false

  componentDidMount() {
    let { setTitle } = this.props
    setTitle('Lupa Password')
    this.setCountdownTimer()
  }

  handleChange(name, value) {
    this.setState(...this.state, { [name]: value })
  }

  // onSubmit = async (e) =>{
  //     e.preventDefault()
  //     e.stopPropagation()

  //     let numberExist = await this.isNumberExist
  //     if(!numberExist) return


  // }
  
  MINUTES_COUNTDOWN = 2
  SECONDS_COUNTDOWN = 0
  @observable min_countdown = this.MINUTES_COUNTDOWN
  @observable sec_countdown = this.SECONDS_COUNTDOWN
  @observable countdownIntervalId = null

  @action
  setCountdownTimer = () =>{
    if(!this.isUnmounted){
      if(this.min_countdown >= 0){
        this.countdownIntervalId = setInterval( () => this.decreaseCount(), 1000 )
      }
    }
  }

  @action
  decreaseCount = () => {
    if(this.min_countdown === 0 && this.sec_countdown === 0){
      clearInterval(this.countdownIntervalId)
      snackbar.show("Waktu untuk penggantian password telah habis! Silakan ulangi kembali")
      this.props.history.push("/auth/forgot")
    } else if(this.sec_countdown === 0){
      this.sec_countdown = 59      
      return --this.min_countdown
    } else{
      return --this.sec_countdown
    }
    
  }

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
          {this.min_countdown + ' : ' + (this.sec_countdown < 10 ? '0' : '') + this.sec_countdown}
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
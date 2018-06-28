//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/new-passowrd.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { appStack } from '../../services/stores'

//CONFIG
import { observable, computed } from 'mobx'

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
  }

  componentDidMount() {
    let { setTitle } = this.props
    setTitle('Lupa Password')
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

  @computed
  get mssidn() {
    let { countryCode, telp } = this.state
    return `${countryCode}${telp}`
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
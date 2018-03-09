//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input'
import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'

//STYLES 
import styles from './css/login.scss'

//THEME
import theme from '../../assets/css/theme.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//INNER_CONFIG
let countryCodes = [
  { value: '886', label: '+886' },
  { value: '62', label: '+62' },
]

//STORE
import { user } from '../../services/stores'

//COMPONENT
class Account extends Component {
  componentDidMount() {
    this.props.setTitle('Login')
  }

  onSubmit = e => {
    e.preventDefault()
    e.stopPropagation()

    let { password, countryCode, telp } = this.state

    if (countryCode === null) return
    user.login(`${countryCode}${telp}`, password).then(token => {
      console.log('FROM LOGIN', token)
    })
  }

  state = {
    countryCode: '886',
    telp: '',
    password: '',
  }

  handleChange(name, value) {
    if (name === 'telp')
      if (value[0] === '0') 
        value = value.split('').slice(1).join('')

    this.setState({ [name]: value })
  }

  render() {
    return (
      <div className={styles.container} >
        <div className={styles.top} >
          <div className={styles.title} ><span>Blanja</span></div>
          <div className={styles.desc} >
            <span>Masukkan nomor telepon anda untuk masuk ke blanja.tw</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={this.onSubmit} >
          <div className={styles.handphone} >
            <Dropdown
              onChange={this.handleChange.bind(this, 'countryCode')}
              source={countryCodes}
              value={this.state.countryCode}
              label="Kode Negara"
            />

            <div className={styles.telp} >
              <Input
                type="number"
                label="Nomor Telepon"
                onChange={this.handleChange.bind(this, 'telp')}
                value={this.state.telp}
                theme={theme}
              />
            </div>
          </div>

          <Input
            type="password"
            label="Password"
            onChange={this.handleChange.bind(this, 'password')}
            value={this.state.password}
            theme={theme}
          />

          <PrimaryButton type="submit" >Login</PrimaryButton>

          <span className={styles.ref} >
            Belum punya akun? <Link to="/auth/register" >Daftar disini</Link>
          </span>
        </form>
      </div>
    )
  }
}

export default Account
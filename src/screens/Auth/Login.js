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
  { value: 'twn', label: '+886' },
  { value: 'idn', label: '+62' },
]

//COMPONENT
class Account extends Component {
  componentDidMount() {
    this.props.setTitle('Login')
  }

  state = {
    countryCode: null,
    telp: '',
    password: '',
  }

  handleChange(name, value) {
    this.setState({ [name]: value })
  }

  render() {
    return (
      <div className={styles.container} >
        <div className={styles.top} >
          <div className={styles.title} ><span>Blanja</span></div>
          <div className={styles.desc} ><span>Masukkan nomor telepon anda untuk masuk ke blanja.tw</span></div>
        </div>

        <form className={styles.form} >
          <div className={styles.handphone} >
            <Dropdown
              auto
              onChange={this.handleChange.bind(this, 'countryCode')}
              source={countryCodes}
              value={this.state.countryCode}
              label="Kode Negara"
            />

            <div className={styles.telp} >
              <Input
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
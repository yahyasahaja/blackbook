//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input'
import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio'

//STYLES 
import styles from './css/register.scss'

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
class Register extends Component {
  componentDidMount() {
    this.props.setTitle('Register')
  }

  state = {
    countryCode: '886',
    telp: '',
    password: '',
    address: '',
    name: '',
    gender: '',
  }

  handleChange(name, value) {
    if (name === 'telp')
      if (value[0] === '0') 
        value = value.split('').slice(1).join('')

    this.setState({ [name]: value })
  }

  onSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    let {
      countryCode,
      telp,
      password,
      address,
      name,
    } = this.state

    user.register(name, `${countryCode}${telp}`, password, address)
  }

  render() {
    return (
      <div className={styles.container} >
        <div className={styles.top} >
          <div className={styles.title} ><span>Blanja</span></div>
          <div className={styles.desc} ><span>
            Masukkan data diri anda untuk menjadi anggota BLANJA
          </span></div>
        </div>

        <form className={styles.form} onSubmit={this.onSubmit} >
          <Input
            type="text"
            label="Nama"
            onChange={this.handleChange.bind(this, 'name')}
            value={this.state.name}
            theme={theme}
          />

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

          <span className={styles.gender}>Jenis Kelamin</span>
          <RadioGroup 
            label="Jenis Kelamin" value={this.state.gender} 
            onChange={this.handleChange.bind(this, 'gender')}
          >
            <RadioButton label='Laki Laki' value='lakilaki' />
            <RadioButton label='Perempuan' value='perempuan' />
          </RadioGroup>

          <Input
            type="text"
            label="Alamat"
            onChange={this.handleChange.bind(this, 'address')}
            value={this.state.address}
            theme={theme}
            multiline
            rows={2}
          />

          <PrimaryButton type="submit" >Register</PrimaryButton>

          <span className={styles.ref} >
            Sudah memiliki akun? <Link to="/auth/login" >Login disini</Link>
          </span>
        </form>
      </div>
    )
  }
}

export default Register
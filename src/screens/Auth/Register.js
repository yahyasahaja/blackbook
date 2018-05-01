//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'

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
  { value: '62', label: '+62' },
]

//STORE
import { user, appStack, snackbar } from '../../services/stores'

//COMPONENT
@observer
class Register extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  componentDidMount() {
    this.props.setTitle('Daftar')
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

    user.register({
      name, 
      msisdn: `${countryCode}${telp}`, 
      password, 
      address, 
      country: countryCode === '886' ? 'TWN' : 'IDN'
    }).then(token => {
      if (!token) snackbar.show('Registrasi gagal!')
    })
  }

  renderButton() {
    if (user.isLoadingUpdateProfile) return (
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
          <div className={styles.title} ><span>Blanja</span></div>
          <div className={styles.desc} ><span>
            Masukkan data diri anda untuk menjadi anggota BLANJA
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
        </form>
      </div>
    )
  }
}

export default Register
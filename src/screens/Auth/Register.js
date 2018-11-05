//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
// import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'

//STYLES 
import styles from './css/login.scss'

//THEME
import theme from '../../assets/css/theme.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { user, snackbar, appStack } from '../../services/stores'

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
    this.props.setTitle('Register')
  }

  onSubmit = e => {
    e.preventDefault()
    e.stopPropagation()

    let { password, countryCode, telp } = this.state

    if (countryCode === null) return
    user.Register(`${countryCode}${telp}`, password).then(token => {
      if (!token) snackbar.show('Nomor telepon atau password anda salah!')
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

  renderButton() {
    if (user.isLoadingRegister) return (
      <div className={styles['loading-wrapper']} >
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    )

    return <PrimaryButton type="submit" >Register</PrimaryButton>
  }

  render() {
    return (
      <div className={styles.container} >
        <div className={styles.top} >
          <div className={styles.title}><img src="/static/img/logo-color.png" alt=""/></div> 
        </div>

        <form className={styles.form} onSubmit={this.onSubmit} >
          <Input
            name="email"
            type="email"
            label="Email"
            onChange={this.handleChange.bind(this, 'email')}
            value={this.state.password}
            theme={theme}
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            onChange={this.handleChange.bind(this, 'password')}
            value={this.state.password}
            theme={theme}
            required
          />

          {this.renderButton()}

          <span className={styles.ref} >
            Sudah memiliki akun? <Link to="/auth/login" >Login disini</Link>
          </span>
          {/* <div className={styles.ref}>
            <Link to="/auth/forgot">Lupa password?</Link> 
          </div> */}
        </form>
      </div>
    )
  }
}

export default Register
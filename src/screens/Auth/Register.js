//MODULES
import React, { Component } from 'react'
import Input from 'react-toolbox/lib/input/Input'
// import Dropdown from 'react-toolbox/lib/dropdown'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { observable } from 'mobx'

//STYLES 
import styles from './css/register.scss'

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

  @observable email = ''
  @observable password = ''
  @observable name = ''

  onSubmit = e => {
    e.preventDefault()
    e.stopPropagation()

    let { name, password, email } = this
    
    user.register(name, email, password).then(token => {
      console.log(token)
      if (!token) snackbar.show('Nomor telepon atau password anda salah!')
    })
  }

  handleChange(name, value) {
    this[name] = value
  }

  renderButton() {
    if (user.isLoadingLoggedIn) return (
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
            name="name"
            type="text"
            label="Name"
            onChange={this.handleChange.bind(this, 'name')}
            value={this.name}
            theme={theme}
            required
          />

          <Input
            name="email"
            type="email"
            label="Email"
            onChange={this.handleChange.bind(this, 'email')}
            value={this.email}
            theme={theme}
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            onChange={this.handleChange.bind(this, 'password')}
            value={this.password}
            theme={theme}
            required
          />

          {this.renderButton()}

          <span className={styles.ref} >
            Sudah punya akun? <Link to="/auth/login" >Login disini</Link>
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
//MODULE
import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/index-edit-profile.scss'
import theme from '../../assets/css/theme.scss'
// import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'

//COMPONENT
@observer
export default class EditProfile extends Component {
  @observable email = ''
  @observable name = ''
  @observable current = ''
  @observable newPassword = ''
  @observable retypePassword = ''

  renderContent() {
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

  render() {
    return (
      <PopupBar
        title={this.state.title} {...this.props}
        renderContent={this.renderContent}
        backLink="/account"
        anim={ANIMATE_HORIZONTAL}
      />
    ) 
  }
}

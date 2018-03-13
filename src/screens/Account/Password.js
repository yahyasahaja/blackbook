//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import Dialog from 'react-toolbox/lib/dialog'

//STYLES
import styles from './css/profile.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import EditableList from '../../components/EditableList'
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { user, snackbar, appStack } from '../../services/stores'

//COMPONENT
@observer
class Auth extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  componentDidMount() {
    user.getProfilePictureURL()
    this.setState({ ...user.data })
    console.log('here i\'m')
  }

  state = {
    oldPassword: '',
    newPassword: '',
    retypePassword: '',
    active: false
  }

  handleChange(name, value) {
    this.setState({ [name]: value })
  }

  updatePassword = () => {
    if (user.isLoadingUpdateProfile) return
    if (this.state.newPassword !== this.state.retypePassword) 
      return snackbar.show('Password does not match!')

    this.setState({ active: false }, () => {
      user.updateProfile({
        ...this.state
      }).then(token => {
        if (token) snackbar.show('Password have been updated')
        this.props.history.push('/account')
      })
    })
  }

  handleToggle = () => {
    this.setState({ active: !this.state.active })
  }

  actions = [
    { label: 'Cancel', onClick: this.handleToggle },
    { label: 'Ok', onClick: this.updatePassword }
  ]

  renderContent = () => {
    let {
      oldPassword,
      newPassword,
      retypePassword,
    } = this.state

    return (
      <div className={styles.container} >
        <div className={styles.card} >
          <EditableList
            label="Current Password" placeholder="Your current password"
            value={oldPassword} type="password"
            onChange={this.handleChange.bind(this, 'oldPassword')}
            border
          />

          <EditableList
            label="New Password" placeholder="Your new password"
            value={newPassword} type="password"
            onChange={this.handleChange.bind(this, 'newPassword')}
            border
          />

          <EditableList
            label="Retype Password" placeholder="Retype your new password"
            value={retypePassword} type="password"
            onChange={this.handleChange.bind(this, 'retypePassword')}
            border
          />

          {this.renderButton()}
          <Dialog
            actions={this.actions}
            active={this.state.active}
            onEscKeyDown={this.handleToggle}
            onOverlayClick={this.handleToggle}
            title='Update Password'
          >
            <p>Anda akan memperbarui kata sandi. Lanjutkan?</p>
          </Dialog>
        </div>
      </div>
    )
  }

  renderButton() {
    if (user.isLoadingUpdateProfile) return (
      <div className={styles['loading-wrapper']} >
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' multicolor
        />
      </div>
    )

    return (
      <PrimaryButton
        className={styles.button}
        type="submit"
        onClick={() => this.setState({ active: true })}
      >
        Update Password
      </PrimaryButton>
    )
  }

  render() {
    return (
      <PopupBar
        title="Password" {...this.props}
        renderContent={this.renderContent}
        backLink="/account"
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default Auth
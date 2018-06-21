//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import Dialog from 'react-toolbox/lib/dialog'

//STYLES
import styles from './css/profile.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

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
            label="Kata Sandi Lama" placeholder="Sandi lama"
            value={oldPassword} type="password"
            onChange={this.handleChange.bind(this, 'oldPassword')}
            border
          />

          <EditableList
            label="Kata Sandi Baru" placeholder="Sandi baru"
            value={newPassword} type="password"
            onChange={this.handleChange.bind(this, 'newPassword')}
            border
          />

          <EditableList
            label="Konfirmasi Sandi" placeholder="Sandi baru"
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
            title='Perbarui Kata Sandi'
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
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    )

    return (
      <PrimaryButton
        className={styles.button}
        type="submit"
        onClick={() => this.setState({ active: true })}
      >
        Ubah Kata Sandi
      </PrimaryButton>
    )
  }

  render() {
    return (
      <PopupBar
        title="Ubah Kata Sandi" {...this.props}
        renderContent={this.renderContent}
        backLink="/account"
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default Auth
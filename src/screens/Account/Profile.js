//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import Dialog from 'react-toolbox/lib/dialog'
import { withTracker } from '../../google-analytics'

//STYLES
import styles from './css/profile.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import EditableList from '../../components/EditableList'
import PrimaryButton from '../../components/PrimaryButton'
// import loadingTheme from '../Chat/css/loading-submit.scss'

//STORE
import { user, snackbar, appStack } from '../../services/stores'

//COMPONENT
@observer
class Profile extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  componentDidMount() {
    user.getProfilePictureURL()
    console.log('USR DATA', user.data)
    this.setState({ ...user.data })
  }

  componentWillReact() {
    this.setState({ ...user.data })
  }

  renderProfilePicture() {
    if (!user.data) return

    let { name } = user.data
    let { profilePictureURL } = user
    let isProfilePictureURLExist = profilePictureURL && profilePictureURL.length > 0

    return (
      <label htmlFor="pic" className={styles.pic} >
        {
          user.isLoadingUploadProfilePic
            ? (
              <div className={styles['pic-loading']} >
                <div className={styles.loading}>
                  <ProgressBar type="circular" mode="indeterminate" />
                </div>
              </div>
            )
            : isProfilePictureURLExist
              ? (
                <img src={profilePictureURL} alt="Profile Picture" />
              )
              : (
                <div className={styles['picture-default']} >
                  <span>{name.split(' ').slice(0, 2).map(v => v[0]).join('')}</span>
                </div>
              )
        }

        <span className={`mdi mdi-pencil ${styles.edit}`} />
        <input
          id="pic" name="pic" type="file" style={{ display: 'none' }}
          onChange={e => {
            user.uploadProfilePicture(e.target.files || e.dataTransfer.files)
          }}
          accept=".jpg, .jpeg, .png"
          disabled={user.isLoadingUploadProfilePic}
        />
      </label>
    )
  }

  state = {
    profilePictureURL: null,
    name: '',
    msisdn: '',
    address: '',
    city: '',
    zip_code: '',
    country: '',
    profilePhotoInput: '',
    active: false,
    active2: false,
  }

  handleChange(name, value) {
    this.setState({ [name]: value })
  }

  updateProfile = () => {
    if (user.isLoadingUpdateProfile) return

    this.setState({ active: false }, () => {
      user.updateProfile({
        ...this.state
      }).then(token => {
        if (token) snackbar.show('Profile has been updated')
      })
    })
  }

  handleToggle = state => {
    this.setState({ [state]: !this.state[state] })
    console.log(this.state)
  }

  actions = [
    { label: 'Cancel', onClick: () => this.handleToggle('active') },
    { label: 'Ok', onClick: this.updateProfile }
  ]

  actions2 = [
    { label: 'Cancel', onClick: () => this.handleToggle('active2') },
    { label: 'Ok', onClick: this.updateProfile }
  ]

  renderContent = () => {
    let {
      name,
      email,
      currentPassword,
      retypePassword,
      newPassword,
    } = this.state

    return (
      <div className={styles.container} >
        <div className={styles.profile} >
          {this.renderProfilePicture()}
        </div>

        <div className={styles.card} >
          <EditableList
            label="Nama" placeholder="Your Name"
            value={name}
            onChange={this.handleChange.bind(this, 'name')}
            border
          />


          <EditableList
            label="Email" placeholder="Your Email"
            value={email} disabled
            onChange={this.handleChange.bind(this, 'email')}
            border
          />

          {this.renderButton()}
          <Dialog
            actions={this.actions}
            active={this.state.active}
            onEscKeyDown={() => this.handleToggle('active')}
            onOverlayClick={() => this.handleToggle('active')}
            title='Update Profile'
          >
            <p>Anda akan memperbarui informasi. Lanjutkan?</p>
          </Dialog>
        </div>

        <div className={styles.card} >
          <EditableList
            label="Nama" placeholder="Your Current Password"
            value={currentPassword}
            onChange={this.handleChange.bind(this, 'currentPassword')}
            border
          />

          <EditableList
            label="Email" placeholder="Your New Password"
            value={newPassword} disabled
            onChange={this.handleChange.bind(this, 'newPassword')}
            border
          />

          <EditableList
            label="Email" placeholder="Retype Password"
            value={retypePassword} disabled
            onChange={this.handleChange.bind(this, 'retypePassword')}
            border
          />

          {this.renderPasswordButton()}
          <Dialog
            actions={this.actions2}
            active={this.state.active2}
            onEscKeyDown={() => this.handleToggle('active2')}
            onOverlayClick={() => this.handleToggle('active2')}
            title='Update Password'
          >
            <p>Anda akan memperbarui password. Lanjutkan?</p>
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
        Simpan Profile
      </PrimaryButton>
    )
  }

  renderPasswordButton() {
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
        onClick={() => this.setState({ active2: true })}
      >
        Update Password
      </PrimaryButton>
    )
  }

  render() {
    user.data
    user.profilePictureURL
    user.isLoadingUploadProfilePic
    return (
      <PopupBar
        title="Profil" {...this.props}
        renderContent={this.renderContent}
        backLink="/account"
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default withTracker(Profile)

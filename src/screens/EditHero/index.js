//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import Dialog from 'react-toolbox/lib/dialog'
import { withTracker } from '../../google-analytics'
import Input from 'react-toolbox/lib/input/Input'

//STYLES
import styles from './css/index-edit-hero.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'
import theme from '../../assets/css/theme.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import PrimaryButton from '../../components/PrimaryButton'
// import loadingTheme from '../Chat/css/loading-submit.scss'

//STORE
import { user, snackbar, appStack, info } from '../../services/stores'
import { observable } from 'mobx';

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

  @observable name = ''
  @observable stat = []
  @observable bio = ''
  @observable ability = []
  @observable tipsDesc = ''
  @observable tipsVideo = ''
  @observable active = false

  handleChange(name, value) {
    this[name] = value
  }

  post = async () => {
    if (user.isLoadingUpdateProfile) return

    this.active = false
    let token = await user.updateProfile({
      ...this.state
    })
    
    if (token) snackbar.show('Profile has been updated')
  }
  
  renderContent = () => {
    return (
      <div className={styles.container} >
        <div className={styles.profile} >
          {this.renderProfilePicture()}
        </div>

        <div className={styles.card} >
          <Input
            type="text"
            label="Name"
            onChange={this.handleChange.bind(this, 'name')}
            value={this.name}
            theme={theme}
            required
          />

          <Input
            type="text"
            label="Bio"
            onChange={this.handleChange.bind(this, 'bio')}
            value={this.bio}
            theme={theme}
            required
          />

          <Input
            type="text"
            label="Tips Description"
            onChange={this.handleChange.bind(this, 'tipsDesc')}
            value={this.bio}
            theme={theme}
            required
          />

          <Input
            type="text"
            label="Tips Video Link"
            onChange={this.handleChange.bind(this, 'tipsVideo')}
            value={this.bio}
            theme={theme}
            required
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
        Save New Hero
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

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
  }

  renderProfilePicture() {
    let { name } = user.data
    let { profilePictureURL } = user

    if (profilePictureURL) if (profilePictureURL.length > 0) return (
      <div className={styles.pic} >
        <img src={profilePictureURL} alt="Profile Picture" />
      </div>
    )

    return (
      <div className={styles['picture-default']} >
        <span>{name.split(' ').slice(0, 2).map(v => v[0]).join('')}</span>
      </div>
    )
  }

  state = {
    profilePictureURL: null,
    name: '',
    msisdn: '',
    address: '',
    city: '',
    zip_code: '',
    active: false
  }

  handleChange(name, value) {
    this.setState({ [name]: value })
  }

  updateProfile = () => {
    if (user.isLoadingUpdateProfile) return

    this.setState({active: false}, () => {
      user.updateProfile({
        ...this.state
      }).then(token => {
        if (token) snackbar.show('Profile have been updated')
      })
    })
  }

  handleToggle = () => {
    this.setState({active: !this.state.active})
  }

  actions = [
    { label: 'Cancel', onClick: this.handleToggle },
    { label: 'Ok', onClick: this.updateProfile }
  ]

  renderContent = () => {
    let {
      name,
      msisdn,
      address,
      city,
      zip_code,
    } = this.state

    return (
      <div className={styles.container} >
        <div className={styles.profile} >
          {this.renderProfilePicture()}
        </div>

        <div className={styles.card} >
        TEST TEST
          <EditableList
            label="Nama" placeholder="Your Name"
            value={name}
            onChange={this.handleChange.bind(this, 'name')}
            border
          />

          <EditableList
            label="No Telepon" placeholder="Your MSISDN"
            value={msisdn}
            onChange={this.handleChange.bind(this, 'msisdn')}
            border disabled
          />

          <EditableList
            label="Alamat" placeholder="Your Address"
            value={address}
            onChange={this.handleChange.bind(this, 'address')}
            border
          />

          <EditableList
            label="Kota" placeholder="Your City"
            value={city}
            onChange={this.handleChange.bind(this, 'city')}
            border
          />

          <EditableList
            label="Kode Pos" placeholder="Your Zip Code"
            value={zip_code}
            onChange={this.handleChange.bind(this, 'zip_code')}
          />

          {this.renderButton()}
          <Dialog
            actions={this.actions}
            active={this.state.active}
            onEscKeyDown={this.handleToggle}
            onOverlayClick={this.handleToggle}
            title='Update Profile'
          >
            <p>Anda akan memperbarui informasi. Lanjutkan?</p>
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
        onClick={() => this.setState({active: true})}
      >
        Simpan Profile
      </PrimaryButton>
    )
  }

  render() {
    return (
      <PopupBar
        title="Profile" {...this.props}
        renderContent={this.renderContent}
        backLink="/account"
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default Auth
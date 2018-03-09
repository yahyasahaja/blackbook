//MODULES
import React, { Component } from 'react'
// import _ from 'lodash'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/profile.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import EditableList from '../../components/EditableList'
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { user } from '../../services/stores'

//COMPONENT
@observer
class Auth extends Component {
  componentDidMount() {
    this.setState({...user.data})
  }

  state = {
    profilePictureURL: null,
    currentPassword: '',
    newPassword: '',
    retypePassword: '',
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  onSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('WILL BE UPDATED', this.state)
  }

  renderContent = () => {
    let {
      currentPassword,
      newPassword,
      retypePassword,
    } = this.state

    return (
      <div className={styles.container} >
        <form onSubmit={this.onSubmit} className={styles.card} >
          <EditableList 
            label="Current Password" placeholder="Your current password"
            value={currentPassword}
            onChange={this.handleChange.bind(this, 'currentPassword')}
            border
          />

          <EditableList 
            label="New Password" placeholder="Your new password"
            value={newPassword}
            onChange={this.handleChange.bind(this, 'newPassword')}
            border
          />

          <EditableList 
            label="Retype Password" placeholder="Retype your new password"
            value={retypePassword}
            onChange={this.handleChange.bind(this, 'retypePassword')}
            border
          />

          <PrimaryButton 
            className={styles.button} 
            type="submit"
          >
            Ganti Password
          </PrimaryButton>
        </form>
      </div>
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
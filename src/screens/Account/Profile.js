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
    user.getProfilePictureURL()
    this.setState({...user.data})
  }
  
  renderProfilePicture() {
    let { name } = user.data
    let { profilePictureURL } = user

    if (profilePictureURL) return (
      <div className={styles.pic} >
        <img src={profilePictureURL} alt="Profile Picture"/>
      </div>
    )

    return (
      <div className={styles['picture-default']} >
        <span>{ name.split(' ').slice(0, 2).map(v => v[0]).join('') }</span>
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

        <form onSubmit={this.onSubmit} className={styles.card} >
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

          <PrimaryButton 
            className={styles.button} 
            type="submit"
          >
            Simpan Profile
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
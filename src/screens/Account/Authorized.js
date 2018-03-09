//MODULES
import React, { Component } from 'react'
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list'

//STYLES
import styles from './css/authorized.scss'

//STORE
import { user } from '../../services/stores'

//COMPONENT
class Account extends Component {
  componentDidMount() {
    user.getProfilePictureURL().then(profilePictureURL => {
      if (profilePictureURL) this.setState({profilePictureURL})
    })
  }

  renderProfilePicture() {
    let { name } = user.data
    let { profilePictureURL } = this.state

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
    profilePictureURL: null
  }

  render() {
    let {
      name,
      msisdn,
    } = user.data

    return (
      <div className={styles.container} >
        <div className={styles.profile} >
          {this.renderProfilePicture()}
          <span className={styles.name} >{name}</span>
          <span className={styles.msisdn} >+{msisdn}</span>
        </div>

        <div className={styles.card} >
          <List selectable ripple> 
            <ListSubHeader caption='Account' />
            <ListItem caption='Profile Saya' leftIcon='account_circle' />
            <ListItem caption='Daftar Transaksi' leftIcon='playlist_add_check' />
            <ListItem caption='Ubah Katasandi' leftIcon='delete' />
            <ListItem caption='Berjualan di Blanja' leftIcon='lock' />
            <ListItem caption='Log Out' leftIcon='input' onClick={() => user.logout()} />
          </List>
        </div>
      </div>
    )
  }
}

export default Account
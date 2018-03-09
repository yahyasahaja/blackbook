//MODULES
import React, { Component } from 'react'
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list'

//STYLES
import styles from './css/authorized.scss'

//STORE
import { user } from '../../services/stores'

//COMPONENT
class Account extends Component {
  renderProfilePicture() {
    let { name } = user.data

    return (
      <div className={styles['picture-default']} >
        <span>{ name.split(' ').slice(0, 2).map(v => v[0]).join('') }</span>
      </div>
    )
  }

  render() {
    let {
      name,
      msisdn
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
            <ListItem caption='Log Out' leftIcon='input' />
          </List>
        </div>
      </div>
    )
  }
}

export default Account
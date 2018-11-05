//MODULES
import React, { Component } from 'react'
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list'
import { observer } from 'mobx-react'
// import { graphql } from 'react-apollo'
// import gql from 'graphql-tag'

//STYLES
import styles from './css/authorized.scss'
// import userClient from '../../services/graphql/productClient'

//STORE
import { user, dialog } from '../../services/stores'
// import HorizontalList from '../../components/HorizontalList'
// import { convertToMoneyFormat } from '../../utils'

//COMPONENT
@observer
class Account extends Component {
  componentDidMount() {
    user.getProfilePictureURL()
  }

  renderProfilePicture() {
    let { name } = user.data
    let { profilePictureURL } = user

    if (profilePictureURL)
      if (profilePictureURL.length > 0)
        return (
          <div className={styles.pic}>
            <img src={profilePictureURL} alt="Profile Picture" />
          </div>
        )

    return (
      <div className={styles['picture-default']}>
        <span>
          {name
            .split(' ')
            .slice(0, 2)
            .map(v => v[0])
            .join('')}
        </span>
      </div>
    )
  }

  state = {
    profilePictureURL: null
  }

  berjualanActions = [{ label: 'Okay', onClick: dialog.toggleActive }]

  closeActions = [
    { label: 'Cancel', onClick: dialog.toggleActive },
    {
      label: 'Keluar',
      onClick: () => {
        user.logout()
        dialog.toggleActive()
      }
    }
  ]

  render() {
    let { name } = user.data

    // let { getUser, loading } = this.props.user

    // let as2in1Wallet = ''
    // if (getUser) as2in1Wallet = getUser.as2in1Wallet

    return (
      <div className={styles.container}>
        <div className={styles.profile}>
          {this.renderProfilePicture()}
          <span className={styles.name}>{name}</span>
        </div>

        <div className={styles.card}>
          <List selectable ripple>
            <ListSubHeader caption="Akun" />
            <ListItem
              caption="Profil Saya"
              leftIcon="account_circle"
              onClick={() => {
                this.props.history.push('/account/profile')
              }}
            />
            <ListItem
              caption="Keluar"
              className={`${styles.logout} logout-button`}
              leftIcon={<span className="mdi mdi-logout-variant" />}
              onClick={() =>
                dialog.show(
                  'Keluar',
                  'Apakah Anda yakin ingin keluar dari Jualbli?',
                  this.closeActions
                )
              }
            />
          </List>
        </div>
      </div>
    )
  }
}

export default Account

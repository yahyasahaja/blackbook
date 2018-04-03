//MODULES
import React, { Component } from 'react'
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/authorized.scss'

//STORE
import { user, dialog } from '../../services/stores'

//COMPONENT
@observer
class Account extends Component {
  componentDidMount() {
    user.getProfilePictureURL()
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
  }

  berjualanActions = [
    { label: 'Okay', onClick: dialog.toggleActive },
  ]

  closeActions = [
    { label: 'Cancel', onClick: dialog.toggleActive },
    {
      label: 'Keluar', onClick: () => {
        user.logout()
        dialog.toggleActive()
      }
    },
  ]

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
            <ListSubHeader caption='Akun' />
            <ListItem
              caption='Profil Saya' leftIcon='account_circle'
              onClick={() => {
                this.props.history.push('/account/profile')
              }}
            />
            <ListItem 
              caption='Daftar Transaksi' 
              leftIcon='playlist_add_check' 
              onClick={() => {
                this.props.history.push('/account/transaction')
              }}
            />
            <ListItem
              caption='Ubah Kata Sandi' leftIcon='lock'
              onClick={() => {
                this.props.history.push('/account/password')
              }}
            />
            <ListItem
              caption='Berjualan di Blanja'
              leftIcon='business_center'
              onClick={() => dialog.show(
                'Berjualan di Blanja',
                <div className={styles.berjualan} >
                  Untuk berjualan di portal Blanja, anda perlu mengunduh aplikasi
                  untuk penjual dan mengunjungi halaman
                  <a className={styles.link} href="https://jual.blanja.tw" target="_blank"> jual.blanja.tw </a>
                  melalui komputer.

                  <div className={styles['img-wrapper']} >
                    <a href="https://blanja.tw/sellerapp/android" target="_blank" >
                      <img className={styles.google} src="/static/img/google_play_badge.png" alt="Google Play Badge" />
                    </a>
                    <a href="https://blanja.tw/sellerapp/ios" target="_blank" >
                      <img className={styles.apple} src="/static/img/app_store_badge.svg" alt="Google Play Badge" />
                    </a>
                  </div>
                </div>,
                this.berjualanActions
              )}
            />
            <ListItem
              caption='Keluar'
              className={styles.logout}
              leftIcon={<span className="mdi mdi-logout-variant" />}
              onClick={() => dialog.show(
                'Keluar',
                'Apakah Anda yakin ingin keluar dari Blanja?',
                this.closeActions,
              )}
            />
          </List>
        </div>
      </div>
    )
  }
}

export default Account
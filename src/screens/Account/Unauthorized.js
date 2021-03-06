//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/unauthorized.scss'

//COMPONENTS
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'

//COMPONENT
class Account extends Component {
  render() {
    return (
      <div className={styles.container} >
        <div className={styles.text} >
          <span className={`mdi mdi-account-circle ${styles.icon}`} />
          <span className={styles.title} >Belum punya akun?</span>
          <span className={styles.desc} >Daftar sekarang untuk pengalaman gamers lebih baik</span>
        </div>

        <div className={styles.button} >
          <PrimaryButton to="/auth/register" >DAFTAR</PrimaryButton>
          <SecondaryButton to="/auth/login" >LOGIN</SecondaryButton>
        </div>
      </div>
    )
  }
}

export default Account
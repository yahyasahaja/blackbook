//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/transaction-list.scss'

//COMPONENTS
import PrimaryButton from './PrimaryButton'

//COMPONENT
class EditableList extends Component {
  render() { 
    let {
      className,
      style,
      disabled
    } = this.props 
    
    return (
      <div 
        className={`${styles.container} ${disabled ? styles.disabled : ''} ${className}`} 
        style={style || {}} 
      >
        <div className={`${styles.section} ${styles.section1}`} > 
          <div className={styles.left} >
            <div className={styles.id} >IVAA00000000005</div>
            <div>10/14/2018</div>
          </div>

          <div className={styles.right} >
            <span>NTD 897</span>
          </div>
        </div>
        <div className={styles.devider} />
        <div className={`${styles.section} ${styles.section2}`} > 
          <div className={styles.wrapper} >
            <img src="/static/img/google_play_badge.png" alt=""/>
          </div>
          <div className={styles.wrapper} >
            <img src="/static/img/google_play_badge.png" alt=""/>
          </div>
          <div className={styles.wrapper} >
            <img src="/static/img/google_play_badge.png" alt=""/>
          </div>
          <div className={styles.wrapper} >
            <img src="/static/img/google_play_badge.png" alt=""/>
          </div>
          
        </div>
        <div className={styles.devider} />
        <div className={`${styles.section} ${styles.section3}`} > 
          <div className={styles.des} >Status Terakhir: </div>
          <div className={styles.status} >Dalam Proses Pembayaran</div>
        </div>
        <div className={styles.devider} />
        <div className={`${styles.section} ${styles.section4}`} > 
          <PrimaryButton className={styles.button} >Detail Transaksi</PrimaryButton>
        </div>
      </div>
    )
  }
}

export default EditableList
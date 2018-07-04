//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/seller-list-card.scss'

//ASSETS
import StoreIcon from '../assets/img/store.svg'

//UTILS
import { limitString } from '../utils'

//COMPONENT
export default class SellerListCard extends Component {
  render() {
    let { className, imageUrl, url, name, allSellersButton, large } = this.props
    
    if (allSellersButton) {
      url = '/sellers'
    }

    return (
      <Link to={url} className={`${className} ${styles.container} ${large ? styles.large : ''}`} >
        <div className={styles.wrapper} >
          <div className={styles['image-wrapper']} >
            <img className={styles.img} src={imageUrl || StoreIcon} alt="seller image" />
          </div>

          <span className={styles.all} >{
            allSellersButton ? 'All Sellers' : !imageUrl ? limitString(name, 10) : ''
          }</span>
        </div>
      </Link>
    )
  }
}
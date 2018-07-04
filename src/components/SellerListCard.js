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
    let style = {}

    if (allSellersButton) {
      url = '/sellers'
    }

    if (allSellersButton || !imageUrl) {
      style = {
        width: 40,
        height: 40,
      }
    }

    return (
      <Link to={url} className={`${className} ${styles.container} ${large ? styles.large : ''}`} >
        <div className={styles.wrapper} >
          <div style={style} className={styles['image-wrapper']} >
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
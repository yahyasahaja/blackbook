//MODULES
import React, { Component } from 'react'
import moment from 'moment'

//STYLES
import styles from './css/transaction-list.scss'

//COMPONENTS
import PrimaryButton from './PrimaryButton'

//UTILS
import { convertCountryCurrency, convertToMoneyFormat } from '../utils'

//COMPONENT
class EditableList extends Component {
  renderImages(sellers) {
    let images = []

    for (let seller of sellers)
      for (let item of seller.items)
        for (let image of item.product.images)
          images.push(image.url)

    return images.slice(0, 4).map((url, i) => {

      return (
        <div key={i} className={styles.wrapper} >
          <img src={url} alt="" />
          {
            images.length > 4 && i == 3 ? (
              <div className={styles.overlay} >
                +{images.length - 4}
              </div>
            ) : ''
          }
        </div>
      )
    })
  }

  onButtonClick(btn, e) {
    e.preventDefault()
    e.stopPropagation()
    
    let { order: { id } } = this.props

    let detailLink = `/account/transaction/detail/${id}`
    let payLink = `/account/transaction/payment/${id}`

    this.props.history.push(btn === 'detail' ? detailLink : payLink)
  }

  render() {
    let {
      className,
      style,
      disabled,
      order: {
        total,
        id,
        status,
        time,
        sellers,
        country
      }
    } = this.props

    return (
      <div
        className={`${styles.container} ${disabled ? styles.disabled : ''} ${className}`}
        style={style || {}}
      >
        <div className={`${styles.section} ${styles.section1}`} >
          <div className={styles.left} >
            <div className={styles.id} >{id}</div>
            <div>{moment(time).format('DD MMM YYYY')}</div>
          </div>

          <div className={styles.right} >
            <span>{convertToMoneyFormat(total, convertCountryCurrency(country))}</span>
          </div>
        </div>
        <div className={styles.devider} />
        <div className={`${styles.section} ${styles.section2}`} >
          {this.renderImages(sellers)}
        </div>
        <div className={styles.devider} />
        <div className={`${styles.section} ${styles.section3}`} >
          <div className={styles.des} >Status Terakhir: </div>
          <div className={styles.status} >{
            status === 'COMPLETE'
              ? 'SELESAI'
              : status === 'UNPAID'
                ? 'BELUM LUNAS'
                : status === 'PAID'
                  ? 'SUDAH LUNAS'
                  : 'DALAM PROSES'
          }</div>
        </div>
        <div className={styles.devider} />
        <div
          className={`${styles.section} ${styles.section4}`} 
          onClick={e => e.stopPropagation()} 
        >
          <PrimaryButton 
            className={styles['transaction-list']} 
            onClick={this.onButtonClick.bind(this, 'detail')}
          >Detail Transaksi</PrimaryButton>
          {
            status === 'UNPAID'
              ? (
                <PrimaryButton 
                  className={styles.pay} 
                  onClick={this.onButtonClick.bind(this, 'pay')}
                >Bayar</PrimaryButton>
              )
              : ''
          }
        </div>
      </div>
    )
  }
}

export default EditableList
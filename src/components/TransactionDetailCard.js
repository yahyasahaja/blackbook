//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/transaction-detail-card.scss'

//COMPONENTS
import PrimaryButton from './PrimaryButton'

//COMPONENT
export default class TransactionDetailCard extends Component {
  translateStatus(name) {
    if (name === 'UNPAID') return 'BELUM LUNAS'
    else if (name === 'PAID') return 'LUNAS'
    else if (name === 'EXPIRED') return 'KADALUARSA'
    else if (name === 'PROGRESS') return 'DALAM PROSES'
    else if (name === 'COURIER') return 'DALAM PENGIRIMAN'
    else if (name === 'RECEIVED') return 'DITERIMA'
    else return 'SELESAI'
  }

  onClick() {

  }

  render() {
    let {
      seller: {
        status,
        seller,
        items,
      }
    } = this.props

    status = this.translateStatus(status)

    let statusColor

    if (status === 'BELUM LUNAS') statusColor = '#e74c3c'
    else if (status === 'SELESAI') statusColor = '#16a085'
    else statusColor = '#2980b9'

    return (
      <div className={styles.container} >
        <div className={styles.sender} >
          {seller.name}
        </div>

        {
          items.map((item, i) => {
            return (
              <div key={i} className={styles.item} >
                <div className={styles.left} >
                  {item.product.images.length > 0 ? <img src={item.product.images[0].url} alt="" /> : '' }
                </div>
                <div className={styles.right} >
                  <div>{item.product.name}</div>
                  <div>Qty: {item.quantity}</div>
                </div>
              </div>
            )
          })
        }
        
        <div className={styles.confirmation} >
          <div 
            className={styles.status} 
            style={{color: statusColor}}
          >{status}</div>
          {
            status === 'DALAM PENGIRIMAN'
              ? <PrimaryButton 
                onClick={this.props.onConfirm}
                className={styles.btn}
              >Konfirmasi</PrimaryButton>
              : ''
          }
        </div>

      </div>
    )
  }
}

//MODULES
import React, { Component } from 'react'
import moment from 'moment'
import gql from 'graphql-tag'

//STYLES
import styles from './css/transaction-list.scss'

//COMPONENTS
import PrimaryButton from './PrimaryButton'

//UTILS
import { convertCountryCurrency, convertToMoneyFormat } from '../utils'

//STORE
import { user, snackbar, dialog, overlayLoading } from '../services/stores'
import orderingClient from '../services/graphql/orderingClient'

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

  async createPayment(orderId) {
    let {
      order: {
        payments
      }
    } = this.props

    let channel = payments.length > 0 ? payments[0].channel : ''

    try {
      overlayLoading.show()

      const {
        data: { addOrderPayment: paymentDetail },
      } = await orderingClient.mutate({
        mutation: AddOrderPayment,
        variables: {
          orderId: orderId,
          input: {
            channel,
          },
        },
      })

      overlayLoading.hide()
      // create payment sukses
      if (paymentDetail.payments.length > 0) {
        snackbar.show(
          `Pembayaran sejumlah ${convertToMoneyFormat(
            paymentDetail.total,
            convertCountryCurrency(paymentDetail.country),
          )} telah berhasil`,
          null,
          null,
          7000,
        )
      }
    } catch (err) {
      console.log(err)
      if (user.data && user.data.country === 'HKG')
        snackbar.show('Balance e-wallet tidak cukup')

      overlayLoading.hide()
      return null
    }
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
        country,
        payments
      }
    } = this.props

    let channel = payments.length > 0 ? payments[0].channel : ''

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
                  onClick={channel === 'AS2IN1WAL' 
                    ? () => dialog.show(
                      'Konfirmasi Pembayaran', 
                      'Anda akan melakukan pembayaran menggunakan e-wallet',
                      [
                        { label: 'Batal', onClick: dialog.toggleActive },
                        { label: 'Bayar', onClick: () => {
                          this.createPayment(id)
                          dialog.toggleActive()
                        }},
                      ]
                    )
                    : this.onButtonClick.bind(this, 'pay')
                  }
                >Bayar</PrimaryButton>
              )
              : ''
          }
        </div>
      </div>
    )
  }
}

export const AddOrderPayment = gql`
  mutation AddOrderPayment($orderId: ID!, $input: OrderPaymentInput!) {
    addOrderPayment(orderId: $orderId, input: $input) {
      id
      country
      total
      payments {
        url
        code
      }
    }
  }
`

export default EditableList
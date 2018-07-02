import React, { Component } from 'react'

import styles from './css/confirmation-item.scss'

import { convertToMoneyFormat } from '../../utils'

export default class ConfirmationItem extends Component {
  render() {
    const {
      product: { name, image, price: { currency, value } },
      variant,
      amount,
    } = this.props
    return (
      <div
        className={styles.container}
      >
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className={styles.info}>
          <span className={styles.name}>{name}</span>
          <div>
            <span className={styles.variant}>{variant}</span>
            <span className={styles.amount}>{`Jumlah: ${amount}`}</span>
          </div>
        </div>
        <div className={styles.right}>
          <span className={styles.price}>
            {convertToMoneyFormat(value * amount, currency)}
          </span>
        </div>
      </div>
    )
  }
}

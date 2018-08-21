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
        data-cyid="confirmation-item"
        className={styles.container}
      >
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className={styles.info}>
          <span data-cyid="confirmation-name" className={styles.name}>{name}</span>
          <div>
            <span data-cyid="confirmation-variant" className={styles.variant}>{variant}</span>
            <span data-cyid="confirmation-amount" className={styles.amount}>{`Jumlah: ${amount}`}</span>
          </div>
        </div>
        <div className={styles.right}>
          <span data-cyid="confirmation-price" className={styles.price}>
            {convertToMoneyFormat(value * amount, currency)}
          </span>
        </div>
      </div>
    )
  }
}

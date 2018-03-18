import React, { Component } from 'react'

import styles from './css/cart-item.scss'

import { cart } from '../../services/stores'
import { convertToMoneyFormat } from '../../utils'

export default class ThreadItem extends Component {
  state = {
    removed: false
  }

  remove(index) {
    this.setState({ removed: true })

    setTimeout(function() {
      cart.remove(index)
    }, 250)
  }

  render() {
    const {
      index,
      product: { name, image, price: { currency, value } },
      variant,
      amount,
    } = this.props
    return (
      <div className={`${styles.container} ${this.state.removed ? styles.removed : ''}`}>
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
          <span
            onClick={() => this.remove(index)}
            className={`mdi mdi-delete ${styles.delete}`}
          />
          <span className={styles.price}>
            {convertToMoneyFormat(value * amount, currency)}
          </span>
        </div>
      </div>
    )
  }
}

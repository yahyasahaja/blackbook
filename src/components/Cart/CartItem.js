import React, { Component } from 'react'

import styles from './css/cart-item.scss'

import { cart } from '../../services/stores'
import { convertToMoneyFormat } from '../../utils'

export default class CartItem extends Component {
  state = {
    removed: false,
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
      product: { id, name, image, price: { currency, value } },
      variant,
      amount,
      history,
    } = this.props
    return (
      <div
        onClick={() => {
          history.push(`/product/${id}`)
        }}
        className={`${styles.container} ${
          this.state.removed ? styles.removed : ''
        }`}
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
          <span
            onClick={(e) => {
              this.remove(index)
              if (!e) e = window.event
              e.cancelBubble = true
              if (e.stopPropagation) e.stopPropagation()          
            }}
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

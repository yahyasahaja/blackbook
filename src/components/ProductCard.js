//MODULES
import React, { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
// import { Link } from 'react-router-dom'

//STYLES
import styles from './css/product-card.scss'

//COMPONENTS
import FlatButton from './FlatButton'
import PrimaryButton from './PrimaryButton'

//STORE
import { favorites, cart } from '../services/stores'

//INNER_CONFIG
const convertToMoneyFormat = (num, currency) => {
  let res = num
    .toString()
    .split('')
    .reverse()
    .reduce(function(acc, num, i) {
      return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc
    }, '')

  return `${currency} ${res}`
}

//COMPONENT
@observer
class ProductCard extends Component {
  state = {
    isVariantOpen: false,
    variant: this.props.variants[0].name,
    amount: 1,
  }

  onLike = () => {
    let { data, id } = this.props
    if (!this.liked) favorites.add(data)
    else favorites.remove(id)
  }

  liked = false

  openVariant() {
    this.setState({ isVariantOpen: true })
  }

  closeVariant() {
    this.setState({ isVariantOpen: false })
  }

  addToCart() {
    const { data } = this.props
    const { variant, amount } = this.state
    cart.add({
      product: data,
      variant,
      amount,
    })
  }

  renderAmountOption() {
    const options = []
    for(let i = 1; i<=30; i++) {
      options.push(<option key={i}>{i}</option>)
    }

    return options
  }

  render() {
    let { image, name, price, variants, /*link,*/ id } = this.props
    this.liked = false
    let fav = favorites.data.slice()
    for (let i in fav)
      if (fav[i].id === id) {
        this.liked = true
        break
      }

    if (!price)
      price = {
        value: 0,
        currency: 0,
      }

    return (
      <div className={styles.container}>
        <div className={styles.picture}>
          <img src={image} alt="Product Image" />
        </div>

        <div className={styles.wrapper}>
          <div className={styles.content}>
            <span className={styles.name}>{name}</span>
            <span className={styles.price}>
              {convertToMoneyFormat(price.value, price.currency)}
            </span>
          </div>

          <div className={styles.actions}>
            {this.state.isVariantOpen ? (
              <div className={styles.variantContent}>
                <p>
                  Detail Pembelian{' '}
                  <span
                    onClick={() => this.closeVariant()}
                    className={`mdi mdi-close ${styles.close}`}
                  />
                </p>
                <div className={styles.variant}>
                  <div className={styles.row}>
                    <label>Varian</label>
                    <div className={styles.select}>
                      <span className={styles.selectText}>{this.state.variant}</span>
                      <select onChange={event => this.setState({variant: event.target.value})}>
                        {variants.map(variant => (
                          <option key={variant.name}>{variant.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <label>Jumlah</label>
                    <div className={styles.select}>
                      <span className={styles.selectText}>{this.state.amount}</span>
                      <select onChange={event => this.setState({amount: event.target.value})}>
                        { this.renderAmountOption() }
                      </select>
                    </div>
                  </div>
                </div>
                <PrimaryButton onClick={() => this.addToCart()} icon="cart" className={styles.buy}>
                  BELI
                </PrimaryButton>
              </div>
            ) : (
              <Fragment>
                <div className={styles.left}>
                  <FlatButton
                    active={this.liked}
                    icon={this.liked ? 'heart' : 'heart-outline'}
                    onClick={this.onLike}
                  >
                    Suka
                  </FlatButton>
                  <FlatButton icon="forum">Chat</FlatButton>
                  <FlatButton icon="share">Bagikan</FlatButton>
                </div>

                <div className={styles.right}>
                  <PrimaryButton onClick={() => this.openVariant()}>
                    BELI
                  </PrimaryButton>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default ProductCard

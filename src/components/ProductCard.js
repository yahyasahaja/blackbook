//MODULES
import React, { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import ReactGA from 'react-ga'

//STYLES
import styles from './css/product-card.scss'

//COMPONENTS
import FlatButton from './FlatButton'
import PrimaryButton from './PrimaryButton'
import ImageLoader from './ImageLoader'

//STORE
import { favorites, cart, snackbar } from '../services/stores'

import { convertToMoneyFormat } from '../utils'

//COMPONENT
@observer
class ProductCard extends Component {
  constructor(props) {
    super(props)

    let { variants } = this.props
    let variant = ''
    if (variants) variant = variants[0].name

    this.state = {
      isVariantOpen: false,
      variant,
      amount: 1,
      isShareActive: false
    }
  }

  onLike = () => {
    let { data, id } = this.props
    if (!this.liked) {
      favorites.add(data)
      ReactGA.event({
        category: 'Product',
        action: 'Likes Product'
      })
    } else {
      favorites.remove(id)
      ReactGA.event({
        category: 'Product',
        action: 'Dislikes Product'
      })
    }
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
      amount
    })

    snackbar.show('Barang ditambahkan ke keranjang')
  }

  renderAmountOption() {
    const options = []
    for (let i = 1; i <= 30; i++) {
      options.push(<option key={i}>{i}</option>)
    }

    return options
  }

  toggleShare = () => {
    this.setState({ isShareActive: !this.state.isShareActive })
  }

  share = id => {
    let link = this.props.shareUrl
    ReactGA.event({
      category: 'Share',
      action: `Share to ${id}`
    })
    window.open(
      id === 'twitter'
        ? `https://twitter.com/share?url=${link}`
        : id === 'facebook'
          ? `https://www.facebook.com/sharer/sharer.php?u=${link}&quote=Jualbli`
          : `https://social-plugins.line.me/lineit/share?url=${link}`,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
    )
  }

  clickBuy = () => {
    this.addToCart()
    ReactGA.event({
      category: 'Order',
      action: 'Add to Cart'
    })
  }

  render() {
    let { images, image, name, price, variants, /*link,*/ id } = this.props
    this.liked = false
    let fav = favorites.data.slice()
    for (let i in fav)
      if (fav[i].id === id) {
        this.liked = true
        break
      }

    if (images && !image) if (images.length > 0) image = images[0].url

    if (!price)
      price = {
        value: 0,
        currency: 'NTD'
      }

    return (
      <div
        className={styles.container}
        data-testid="product-card"
        onClick={() => this.props.history.push(`/product/${id}`)}
      >
        <div className={styles.picture}>
          <ImageLoader src={image} alt="Product Image" />
        </div>

        <div className={styles.wrapper}>
          <div className={styles.content}>
            <span className={styles.name}>{name}</span>
            <span className={styles.price}>
              {convertToMoneyFormat(price.value, price.currency)}
            </span>
          </div>

          <div
            data-testid="product-card-action"
            className={styles.actions}
            onClick={e => e.stopPropagation()}
          >
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
                      <span className={styles.selectText}>
                        {this.state.variant}
                      </span>
                      <select
                        onChange={event =>
                          this.setState({ variant: event.target.value })
                        }
                      >
                        {variants.map(variant => (
                          <option key={variant.name}>{variant.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <label>Jumlah</label>
                    <div className={styles.select}>
                      <span className={styles.selectText}>
                        {this.state.amount}
                      </span>
                      <select
                        onChange={event =>
                          this.setState({ amount: event.target.value })
                        }
                      >
                        {this.renderAmountOption()}
                      </select>
                    </div>
                  </div>
                </div>
                <PrimaryButton
                  onClick={() => this.clickBuy()}
                  icon="cart"
                  className={styles.buy}
                >
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
                  <Link
                    to={{ pathname: '/chat/new', state: { productId: id } }}
                    data-testid="chat"
                  >
                    <FlatButton icon="forum">Chat</FlatButton>
                  </Link>
                  <FlatButton onMouseOver={this.toggleShare} icon="share">
                    Bagikan
                  </FlatButton>
                  <div
                    className={`${
                      this.state.isShareActive ? styles.active : ''
                    } ${styles.share}`}
                  >
                    <a
                      onClick={this.share.bind(this, 'facebook')}
                      href="javascript:void(0)"
                      className={`mdi mdi-facebook ${styles.icon} ${
                        styles.facebook
                      }`}
                    />
                    <a
                      onClick={this.share.bind(this, 'twitter')}
                      href="javascript:void(0)"
                      className={`mdi mdi-twitter ${styles.icon} ${
                        styles.twitter
                      }`}
                    />
                    <img
                      src="/static/icon/line.png"
                      onClick={this.share.bind(this, 'line')}
                      href="javascript:void(0)"
                      className={`mdi mdi-pinterest ${styles.icon}`}
                    />
                  </div>
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

export default withRouter(ProductCard)

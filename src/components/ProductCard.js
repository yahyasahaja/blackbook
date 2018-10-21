//MODULES
import React, { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import ReactGA from 'react-ga'
// import gql from 'graphql-tag' 

//STYLES
import styles from './css/product-card.scss'

//COMPONENTS
import FlatButton from './FlatButton'
import PrimaryButton from './PrimaryButton'
import ImageLoader from './ImageLoader'

//STORE
import { favorites, cart, snackbar, user } from '../services/stores'
// import client from '../services/graphql/productClient'

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

  componentDidMount() {
    this.totalLikeRaw = this.props.favorited ? this.props.liked - 1 : this.props.liked
  }

  onLike = async () => {
    let { data, id } = this.props
    if (!this.isLiked) {
      if (!user.isLoggedIn) return this.props.history.push('/auth/login')
      await favorites.add(data)
      ReactGA.event({
        category: 'Product',
        action: 'Likes Product'
      })
    } else {
      await favorites.remove(id)
      ReactGA.event({
        category: 'Product',
        action: 'Dislikes Product'
      })
    }
  }

  isLiked = false
  totalLikeRaw = 0

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

    // snackbar.show('Barang ditambahkan ke keranjang')
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

    if (id === 'copy') {
      window.Clipboard.copy(link)
      snackbar.show('URL berhasil disalin')
      return
    }

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

  get isMyOwnProduct() {
    return this.props.seller.id === (user.isLoggedIn && user.data.uuid)
  }

  render() {
    let { images, image, name, price, variants, /*link,*/ id} = this.props
    
    this.isLiked = false
    let fav = favorites.data.slice()
    for (let i in fav)
      if (fav[i].id === id) {
        this.isLiked = true
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
                  onClick={() => !this.isMyOwnProduct && this.clickBuy()}
                  icon="cart"
                  className={`${this.isMyOwnProduct && styles.disabled} ${styles.buy}`}
                >
                  BELI
                </PrimaryButton>
              </div>
            ) : (
              <Fragment>
                <div className={styles.left}>
                  <FlatButton
                    active={this.isLiked}
                    icon={this.isLiked ? 'heart' : 'heart-outline'}
                    onClick={this.onLike}
                    data-testid="like-button"
                  >
                    {this.totalLikeRaw + (this.isLiked ? 1 : 0)}
                  </FlatButton>
                  <Link
                    to={{ pathname: '/chat/new', state: { productId: id } }}
                    data-testid="chat"
                    className={(this.isMyOwnProduct && styles.disabled) || ''}
                    onClick={e => this.isMyOwnProduct && e.preventDefault()}
                  >
                    <FlatButton icon="forum" />
                  </Link>
                  <FlatButton onMouseOver={this.toggleShare} icon="share" />
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
                    <img
                      src="/static/icon/line.png"
                      onClick={this.share.bind(this, 'line')}
                      href="javascript:void(0)"
                      className={`mdi mdi-pinterest ${styles.icon}`}
                    />
                    <a
                      onClick={this.share.bind(this, 'twitter')}
                      href="javascript:void(0)"
                      className={`mdi mdi-twitter ${styles.icon} ${
                        styles.twitter
                      }`}
                    />
                    <a
                      onClick={this.share.bind(this, 'copy')}
                      href="javascript:void(0)"
                      className={`mdi mdi-content-copy ${styles.icon} ${
                        styles.copy
                      }`}
                    />
                  </div>
                </div>

                <div className={`${this.isMyOwnProduct && styles.disabled} ${styles.right}`}>
                  <PrimaryButton onClick={() => !this.isMyOwnProduct && this.openVariant()}>
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

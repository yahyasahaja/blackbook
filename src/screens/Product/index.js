//MODULES
import React, { Component, Fragment } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import Slider from '../../components/Slider'

//STYLES
import styles from './css/index-product.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import FlatButton from '../../components/FlatButton'
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { appStack, favorites, cart, snackbar } from '../../services/stores'

//INNER_CONFIG
const convertToMoneyFormat = (num, currency) => {
  let res = num
    .toString()
    .split('')
    .reverse()
    .reduce(function (acc, num, i) {
      return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc
    }, '')

  return `${currency} ${res}`
}

//COMPONENTs
@observer
class PromoDetail extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  componentDidMount() {
    let product = this.props.productQuery.product

    if (product) this.setState({ variant: product.variants[0].name })
  }

  componentWillReceiveProps(nextProps) {
    this.checkAllProductChanges(nextProps)
  }

  checkAllProductChanges(nextProps) {
    let { productQuery: { loading: next, product } } = nextProps
    let { productQuery: { loading: cur } } = this.props

    if (cur !== next && product && !next) {
      setTimeout(() =>
        this.setState({ variant: product.variants[0].name }), 100)
    }
  }

  state = {
    isLoadingImageError: false,
    isVariantOpen: false,
    amount: 1,
    variant: null,
    stock: 0,
    isShareActive: false,
  }

  copy = () => {
    this.inputCode.select()
    document.execCommand('Copy')
  }

  onLike = () => {
    let { product } = this.props.productQuery
    if (!this.liked) favorites.add(product)
    else favorites.remove(product.id)
  }

  liked = false

  openVariant() {
    this.setState({ isVariantOpen: true })
  }

  closeVariant() {
    this.setState({ isVariantOpen: false })
  }

  addToCart() {
    const { product } = this.props.productQuery
    const { variant, amount } = this.state
    cart.add({
      product: {
        ...product,
        image: product.images[0].url
      },
      variant,
      amount,
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

  renderStock = () => {
    let { product } = this.props.productQuery

    if (!product) return

    let { variants } = product

    if (variants.length > 1) return (
      <Fragment>
        <div style={{ fontWeight: 'bold' }} >Stock:</div>
        {variants.map((data, i) => {
          return (
            <div key={i} >{data.name}: {data.quantity}</div>
          )
        })}
      </Fragment>
    )

    return (
      <Fragment>
        <span><span style={{ fontWeight: 'bold' }} >Stock:</span> {variants[0].quantity}</span>
      </Fragment>
    )
  }

  toggleShare = () => {
    this.setState({ isShareActive: !this.state.isShareActive })
  }

  share = id => {
    let { product_id } = this.props.match.params
    let link = `${window.location.origin}/product/${product_id}`

    window.open(
      id === 'twitter'
        ? `https://twitter.com/share?url=${link}`
        : id === 'facebook'
          ? `https://www.facebook.com/sharer/sharer.php?u=${link}&quote=Blanja`
          : `http://pinterest.com/pin/create/button/?url=${link}`,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
    )
  }

  renderContent = () => {
    if (this.props.productQuery.loading)
      return (
        <div className={styles.container}>
          <ProgressBar
            className={styles.loading}
            type='circular' theme={ProgressBarTheme}
            mode='indeterminate'
          />
        </div>
      )
    
    let { name, images, id, price, variants, description, seller } = this.props.productQuery.product
    this.liked = false
    let fav = favorites.data.slice()
    for (let i in fav)
      if (fav[i].id === id) {
        this.liked = true
        break
      }

    return (
      <div className={styles.container}>
        <div className={styles.card} >
          <div className={styles.picture}>
            <Slider
              items={images.map(image => image.url)}
              showThumbnails={false}
              showBullets={true}
              showPlayButton={false}
              showFullscreenButton={false}

            >
            </Slider>
          </div>

          <div className={styles.wrapper}>
            <div className={styles.content}>
              <span className={styles.name}>{name}</span>
              <span className={styles.price}>
                {convertToMoneyFormat(price.value, price.currency)}
              </span>
              <span className={styles.desc}>{description}</span>
              {this.renderStock()}
            </div>

            <div className={styles.actions}>
              {
                this.state.isVariantOpen ? (
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
                          <select onChange={event => this.setState({ variant: event.target.value })}>
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
                          <select onChange={event => this.setState({ amount: event.target.value })}>
                            {this.renderAmountOption()}
                          </select>
                        </div>
                      </div>
                    </div>
                    <PrimaryButton onClick={() => this.addToCart()} icon="cart" className={styles.buy}>
                      BELI
                    </PrimaryButton>
                  </div>
                )
                  : (
                    <Fragment>
                      <div className={styles.left}>
                        <FlatButton
                          active={this.liked}
                          icon={this.liked ? 'heart' : 'heart-outline'}
                          onClick={this.onLike}
                        >
                          Suka 
                        </FlatButton>
                        <Link to={{ pathname: '/chat/new', state: { productId: id } }}>
                          <FlatButton icon="forum">Chat</FlatButton>
                        </Link>
                        <FlatButton onMouseOver={this.toggleShare} icon="share">Bagikan</FlatButton>
                        <div
                          className={
                            `${this.state.isShareActive ? styles.active : ''} ${styles.share}`
                          }
                        >
                          <a
                            onClick={this.share.bind(this, 'facebook')}
                            href="javascript:void(0)"
                            className={`mdi mdi-facebook ${styles.icon} ${styles.facebook}`}
                          />
                          <a
                            onClick={this.share.bind(this, 'twitter')}
                            href="javascript:void(0)"
                            className={`mdi mdi-twitter ${styles.icon} ${styles.twitter}`}
                          />
                          <a
                            onClick={this.share.bind(this, 'pinterest')}
                            href="javascript:void(0)"
                            className={`mdi mdi-pinterest ${styles.icon} ${styles.instagram}`}
                          />
                        </div>
                      </div>

                      <div className={styles.right}>
                        <PrimaryButton onClick={() => this.openVariant()}>
                          BELI
                        </PrimaryButton>
                      </div>
                    </Fragment>
                  )
              }
            </div>
          </div>
        </div>

        <div className={styles.card} >
          <div className={styles.seller} >
            <img src={seller.profilePicture} />
            <span>
              <div>{seller.name}</div>
              <div>{seller.country}</div>
            </span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title="Detail Produk" {...this.props}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
        cart
      />
    )
  }
}

const productQuery = gql`
query productQuery ($id: ID!) {
  product (productId: $id) {
    id,
    name,
    sku,
    description,
    images {
      url,
      priority
    },
    variants {
      name,
      quantity 
    },
    keywords,
    category,
    shipping {
      length,
      width,
      height,
      weight
    },
    seller {
      name,
      profilePicture,
      country,
    },
    price {
      value,
      currency
    },
    country,
    liked,
    created,
    updated
  }
}
`

export default graphql(
  productQuery, {
    name: 'productQuery',
    options: props => {
      return {
        variables: { id: props.match.params.product_id }
      }
    }
  }
)(PromoDetail)

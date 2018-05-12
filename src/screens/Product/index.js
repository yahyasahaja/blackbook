//MODULES
import React, { Component, Fragment } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/index-product.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import FlatButton from '../../components/FlatButton'
import PrimaryButton from '../../components/PrimaryButton'
import Slider from '../../components/Slider'
import Card from '../../components/ProductCard'
import Separator from '../../components/Separator'

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

//CONSTS
const MAX_FETCH_LENGTH = 5

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

  componentWillReceiveProps(nextProps) {
    this.checkAllProductsChanges(nextProps)
    this.checkThisProductChanges(nextProps)
  }

  checkSelectedChanges(nextProps) {
    let isSelectedCurrent = nextProps.isSelected
    let isSelectedBefore = this.props.isSelected

    if (isSelectedCurrent != isSelectedBefore)
      this.addScrollListener(isSelectedCurrent)
  }

  checkAllProductsChanges(nextProps) {
    let { productRelationsQuery: { loading: newLoading, error: newError } } = nextProps
    let { productRelationsQuery: { loading: curLoading } } = this.props

    // console.log('TRIGGERED', nextProps)

    if (curLoading !== newLoading && !newLoading && !newError) {
      this.updateAndFetchMoreProductRelations(nextProps)
    } else if (newError) {
      //tokens.refetchAPIToken().then(() => window.location.reload())
    }
  }

  updateAndFetchMoreProductRelations(nextProps) {
    let productRelations = nextProps.productRelationsQuery.productRelations
    let { offset } = this.state

    if (!productRelations) return

    let products = productRelations.map(({ product }) => {
      if (product.images.length > 0)
        return { ...product, image: product.images[0].url }
    })

    this.setState({
      products: [...products],
      offset: offset + MAX_FETCH_LENGTH,
      isFetchDisabled: this.state.products.length === 5
    })
  }

  componentDidMount() {
    let { productQuery: { product } } = this.props

    if (product) this.setState({ variant: product.variants[0].name })
    this.updateAndFetchMoreProductRelations(this.props)

    this.before = this.current = document.documentElement.scrollTop
    window.scrollTo(0, 0)
    this.addScrollListener(this.props.isSelected)
    this.checkScroll()
  }

  addScrollListener(isSelected) {
    if (isSelected) {
      window.addEventListener('scroll', this.checkScroll)
      window.addEventListener('gesturechange', this.checkScroll)
    } else {
      window.removeEventListener('scroll', this.checkScroll)
      window.removeEventListener('gesturechange', this.checkScroll)
    }
  }

  checkScroll = () => {
    let scrollPosition = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
    let pageHeight = document.body.scrollHeight
    let screenHeight = document.body.offsetHeight
    let { productRelationsQuery: { loading, refetch } } = this.props
    let { offset } = this.state

    if (loading) return
    if (scrollPosition < pageHeight - screenHeight - screenHeight * .1) return
    if (this.state.isFetchDisabled) return
    if (appStack.isPopupActive) return
    refetch({ limit: MAX_FETCH_LENGTH, offset })
  }

  checkThisProductChanges(nextProps) {
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
    products: [],
    offset: 0,
    isFetchDisabled: false,
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
    let { shareUrl } = this.props.productQuery.product
    let link = shareUrl

    window.open(
      id === 'twitter'
        ? `https://twitter.com/share?url=${link}`
        : id === 'facebook'
          ? `https://www.facebook.com/sharer/sharer.php?u=${link}&quote=Blanja`
          : `https://social-plugins.line.me/lineit/share?url=${link}`, 
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
    )
  }

  renderCards() {
    let { products } = this.state

    console.log(products)

    return products.map((data, i) => <Card favorites={favorites} {...data} key={i} data={data} />)
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
                          <img
                            src="/static/icon/line.png" 
                            onClick={this.share.bind(this, 'line')} 
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
                  )
              }
            </div>
          </div>
        </div>

        <div className={styles.card} >
          <div className={styles.seller} >
            {
              seller.profilePicture
                ? <img src={seller.profilePicture} />
                : <div className={styles.pic}>{
                  seller.name.split(' ').slice(0, 2).map(d => d[0]).join('')
                }</div>
            }
            <span>
              <div>{seller.name}</div>
              <div>{seller.country}</div>
            </span>
          </div>
        </div>

        <Separator className={styles.separator} >Produk Menarik Lainnya</Separator>
        {this.renderCards()}
        {
          this.props.productRelationsQuery.loading
            ? <ProgressBar
              className={styles.loading}
              type='circular' theme={ProgressBarTheme}
              mode='indeterminate'
            />
            : ''
        }
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
    shareUrl
  }
}
`

const productRelationsQuery = gql`
query productRelationsQuery ($productId: ID!, $limit: Int) {
  productRelations(productId: $productId, limit: $limit) {
    product {
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
      updated,
      shareUrl,
    }
    
    count
  }
}
`

export default compose(
  graphql(
    productQuery, {
      name: 'productQuery',
      options: props => {
        return {
          variables: { id: props.match.params.product_id }
        }
      }
    }
  ),
  graphql(
    productRelationsQuery, {
      name: 'productRelationsQuery',
      options: props => {
        return {
          variables: { productId: props.match.params.product_id, limit: MAX_FETCH_LENGTH }
        }
      }
    }
  ),
)(PromoDetail)

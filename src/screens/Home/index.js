//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { Link } from 'react-router-dom'
import { List, ListItem } from 'react-toolbox/lib/list'
import ReactGA from 'react-ga'
import Slider from 'react-slick'
import { withTracker } from '../../google-analytics'

//STYLES
import styles from './css/index.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import TopBar, { APPEAR } from '../../components/TopBar'
import Card from '../../components/ProductCard'
import SellerListCard from '../../components/SellerListCard'
// import Pills from '../../components/Pills'
// import Separator from '../../components/Separator'

//SVG
import Smartphone from '../../assets/img/smartphone-white.svg'
import Dress from '../../assets/img/dress-white.svg'
import TShirt from '../../assets/img/t-shirt-white.svg'

//STORE
import {
  categories as categoriesStore,
  appStack,
  favorites
} from '../../services/stores'
import client from '../../services/graphql/productClient'

//INNER_CONFIG
const MAX_FETCH_LENGTH = 5

//COMPONENT
@observer
class Home extends Component {
  
  //PROPERTIES
  @observable isFetchingSellers = false
  @observable allSellers = []

  //FOR ANALYTICS PURPOSES
  firstCard = null

  componentWillReceiveProps(nextProps) {
    this.checkSelectedChanges(nextProps)
    this.checkAllCategoriesChanges(nextProps)
    this.checkAllProductsChanges(nextProps)
    // this.checkAllAdvertisementsChanges(nextProps)
  }

  checkSelectedChanges(nextProps) {
    let isSelectedCurrent = nextProps.isSelected
    let isSelectedBefore = this.props.isSelected

    if (isSelectedCurrent != isSelectedBefore)
      this.addScrollListener(isSelectedCurrent)
  }

  checkAllCategoriesChanges(nextProps) {
    let {
      allCategoriesQuery: { loading: newAllCategoriesLoading }
    } = nextProps
    let {
      allCategoriesQuery: { loading: curAllCategoriesLoading }
    } = this.props

    if (
      curAllCategoriesLoading !== newAllCategoriesLoading &&
      !newAllCategoriesLoading
    )
      categoriesStore.setCategories(nextProps.allCategoriesQuery.allCategories)
  }

  checkAllProductsChanges(nextProps) {
    let {
      activePromotedsQuery: { loading: newLoading, error: newError }
    } = nextProps
    let {
      activePromotedsQuery: { loading: curLoading }
    } = this.props

    // console.log('TRIGGERED', nextProps)

    if (curLoading !== newLoading && !newLoading && !newError) {
      let activePromoteds = nextProps.activePromotedsQuery.activePromoteds
      let { offset } = this.state

      let products = activePromoteds.promoteds.map(({ product }) => {
        if (product.images.length > 0)
          return { ...product, image: product.images[0].url }
        return { ...product, image: '' }
      })

      this.setState({
        products: [...this.state.products, ...products],
        offset: offset + MAX_FETCH_LENGTH,
        isFetchDisabled:
          this.state.products.length === activePromoteds.totalCount
      })
    } else if (newError) {
      return console.log(newError)
      // tokens.refetchAPIToken().then(() => window.location.reload())
    }
  }

  componentWillUnmount() {
    window.document.body.onscroll = null
  }

  componentDidMount() {
    //ANALYTICS
    window.document.body.onscroll = () => {
      if (this.firstCard.getBoundingClientRect().top >= 0) {
        ReactGA.event({
          category: 'Seeking featured Product',
          action: 'Seeking featured Product'
        })
        window.document.body.onscroll = null
      }
    }

    this.before = this.current = document.documentElement.scrollTop
    window.scrollTo(0, 0)
    this.addScrollListener(this.props.isSelected)
    this.checkScroll()
    this.fetchSellers()
  }

  async fetchSellers() {
    try {
      this.isFetchingSellers = true

      const {
        data: { allSellers }
      } = await client.query({
        query: allSellersQuery,
        variables: {
          offset: 0,
          limit: 3
        }
        // fetchPolicy: 'network-only'
      })

      this.allSellers = allSellers.sellers
    } catch (e) {
      console.log(e)
    }

    this.isFetchingSellers = false
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
    let scrollPosition = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    )
    let pageHeight = document.body.scrollHeight
    let screenHeight = document.body.offsetHeight
    let {
      activePromotedsQuery: { loading, refetch }
    } = this.props
    let { offset } = this.state

    if (loading) return
    if (scrollPosition < pageHeight - screenHeight - screenHeight * 0.1) return
    if (this.state.isFetchDisabled) return
    if (appStack.isPopupActive) return
    refetch({ limit: MAX_FETCH_LENGTH, offset })
  }

  state = {
    products: [],
    advertisements: [],
    offset: 0,
    isFetchDisabled: false,
    areAllCategoriesPoppedUp: false
  }

  renderCards() {
    let { products } = this.state
    let finalProducts = []
    // console.log(products)

    for (let i in products) {
      let product = products[i]

      if (products.length > 15) {
        if (i === 11) {
          finalProducts.push({ allSellersSection: true })
          continue
        }
      }

      finalProducts.push(product)
    }

    if (products.length < 15) {
      finalProducts.push({ allSellersSection: true })
    }

    return finalProducts.map((data, i) => {
      if (data.allSellersSection) {
        return (
          <div className={styles.sellers} key={i}>
            <div className={styles.title}>Sellers</div>

            <div className={styles.wrapper}>{this.renderSellerList()}</div>
          </div>
        )
      }

      return (
        <div
          ref={el => {
            if (i === 0) this.firstCard = el
          }}
          key={i}
        >
          <Card favorites={favorites} {...data} data={data} />
        </div>
      )
    })
  }

  renderSellerList() {
    if (this.isFetchingSellers)
      return (
        <ProgressBar
          className={styles.loading}
          type="circular"
          theme={ProgressBarTheme}
          mode="indeterminate"
        />
      )

    let finalSellers = this.allSellers.slice()

    finalSellers.push({ allSellersButton: true })

    return finalSellers.map((data, i) => {
      if (data.allSellersButton) return <SellerListCard key={i} {...data} />

      return (
        <SellerListCard
          imageUrl={data.profilePicture}
          url={`/seller/${data.id}`}
          key={i}
          name={data.name}
        />
      )
    })
  }

  renderCategories() {
    let data = [
      {
        img: <img src={Smartphone} />,
        name: 'Handphone',
        id: 'Handphone'
      },
      {
        img: <img src={Dress} />,
        name: (
          <span>
            Fashion<br /> Wanita
          </span>
        ),
        id: 'Fashion Wanita'
      },
      {
        img: <img src={TShirt} />,
        name: (
          <span>
            Fashion<br /> Pria
          </span>
        ),
        id: 'Fashion Pria'
      },
      {
        img: <span className="mdi mdi-format-list-bulleted" />,
        name: 'Kategori',
        id: 'categories'
      }
    ]

    return data.map((data, i) => {
      return (
        <Link
          to={`/category/${data.id}`}
          key={i}
          className={styles.category}
          onClick={e => {
            ReactGA.event({
              category: 'Select Category',
              action: `Select ${
                data.id === 'categories'
                  ? 'All Category'
                  : `${data.id} category`
              }`
            })
            if (data.id === 'categories') {
              e.preventDefault()
              this.setState({ areAllCategoriesPoppedUp: true })
            }
          }}
        >
          <div className={styles.img}>{data.img}</div>
          <span className={styles['category-name']}>{data.name}</span>
        </Link>
      )
    })
  }

  renderAdsPanel = () => {
    const images = [
      {
        id: '2d3a2c7a-7bba-438a-8c60-b079d6dd4b04',
        imageUrl: '/static/img/placeimg_640_480_tech1.jpg'
      },
      {
        id: 'edd8bdf0-f89c-436a-a6f7-7e9749c7d020',
        imageUrl: '/static/img/placeimg_640_480_tech2.jpg'
      },
      {
        id: 'e4b5d98f-0e0c-483d-ae46-6eed890b402d',
        imageUrl: '/static/img/placeimg_640_480_tech3.jpg'
      }
    ]

    return images.map((image, i) => {
      return (
        <Link key={i} to={`/promo/${image.id}`}>
          <img className={styles.ads} src={image.imageUrl} />
        </Link>
      )
    })
  }

  renderAllCategories() {
    let {
      allCategoriesQuery: { allCategories }
    } = this.props
    let { areAllCategoriesPoppedUp } = this.state

    if (!areAllCategoriesPoppedUp || !allCategories) return

    return (
      <div className={styles['all-categories']}>
        <div className={styles.header}>
          <span
            onClick={() => this.setState({ areAllCategoriesPoppedUp: false })}
            className={`mdi mdi-arrow-left ${styles.back}`}
          />
          <span className={styles.title}>Semua Kategori</span>
        </div>
        <List selectable ripple>
          {allCategories.map((data, i) => {
            return (
              <ListItem
                key={i}
                caption={data.name}
                onClick={() => {
                  this.setState({ areAllCategoriesPoppedUp: false })
                  this.props.history.push(`/category/${data.name}`)
                }}
              />
            )
          })}
        </List>
      </div>
    )
  }

  render() {
    let settings = {
      autoplay: true,
      dots: true,
      dotsClass: 'slick-dots',
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false
    }
    let {
      activePromotedsQuery: { loading }
    } = this.props
    let { areAllCategoriesPoppedUp } = this.state
    let style = {}

    if (areAllCategoriesPoppedUp)
      style = {
        maxHeight: '100vh',
        overflow: 'hidden'
      }

    return (
      <TopBar
        relative={{
          title: { cart: true },
          search: { cart: false }
        }}
        fly={{
          search: { cart: true },
          mode: APPEAR
        }}
        isSelected={this.props.isSelected}
        style={{ background: 'rgb(239, 239, 239)' }}
        wrapperStyle={{ padding: 0 }}
      >
        <Slider {...settings}>{this.renderAdsPanel()}</Slider>
        <div style={style}>
          <div className={styles.categories}>{this.renderCategories()}</div>

          {this.renderCards()}
          {loading ? (
            <ProgressBar
              className={styles.loading}
              type="circular"
              theme={ProgressBarTheme}
              mode="indeterminate"
            />
          ) : (
            ''
          )}
        </div>

        {this.renderAllCategories()}
      </TopBar>
    )
  }
}

const allCategoriesQuery = gql`
  query {
    allCategories {
      name
      children {
        name
      }
    }
  }
`

const activePromotedsQuery = gql`
  query activePromoteds($limit: Int, $offset: Int) {
    activePromoteds(limit: $limit, offset: $offset) {
      promoteds {
        product {
          id
          name
          price {
            value
            currency
          }
          variants {
            name
          }
          images {
            url
          }
          shareUrl
        }
      }
      totalCount
    }
  }
`

const activeAdvertisementsQuery = gql`
  query activeAdvertisements($limit: Int){
    activeAdvertisements(limit: $limit){
      advertisements{
        id
        imageUrl
        targetUrl
        begin
        end
        country
      }
      totalCount
    }
  }
`

const allSellersQuery = gql`
  query allSellers {
    allSellers(limit: 4) {
      sellers {
        id
        name
        profilePicture
      }
    }
  }
`

export default compose(
  withTracker,
  graphql(allCategoriesQuery, {
    name: 'allCategoriesQuery',
    skip: () => categoriesStore.data === null
  }),
  graphql(activePromotedsQuery, {
    name: 'activePromotedsQuery',
    options: () => {
      return {
        variables: { limit: MAX_FETCH_LENGTH, offset: 0 }
      }
    }
  }),
  graphql(activeAdvertisementsQuery, {
    name: 'activeAdvertisementsQuery',
    options: () => {
      return{
        variables: { limit: 10 }
      }
    }
  })
)(Home)

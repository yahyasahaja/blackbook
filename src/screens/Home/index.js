//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import _ from 'lodash'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/index.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import TopBar, { APPEAR } from '../../components/TopBar'
import Card from '../../components/ProductCard'
import Pills from '../../components/Pills'
import Separator from '../../components/Separator'

//STORE
import { categories as categoriesStore, appStack, favorites } from '../../services/stores'

//INNER_CONFIG
const MAX_FETCH_LENGTH = 5

//COMPONENT
@observer
class Home extends Component {
  componentWillReceiveProps(nextProps) {
    this.checkSelectedChanges(nextProps)
    this.checkAllCategoriesChanges(nextProps)
    this.checkAllProductsChanges(nextProps)
  }

  checkSelectedChanges(nextProps) {
    let isSelectedCurrent = nextProps.isSelected
    let isSelectedBefore = this.props.isSelected

    if (isSelectedCurrent != isSelectedBefore)
      this.addScrollListener(isSelectedCurrent)
  }

  checkAllCategoriesChanges(nextProps) {
    let { allCategoriesQuery: { loading: newAllCategoriesLoading } } = nextProps
    let { allCategoriesQuery: { loading: curAllCategoriesLoading } } = this.props

    if (curAllCategoriesLoading !== newAllCategoriesLoading && !newAllCategoriesLoading)
      categoriesStore.setCategories(nextProps.allCategoriesQuery.allCategories)
  }

  checkAllProductsChanges(nextProps) {
    let { allProductsQuery: { loading: newLoading, error: newError } } = nextProps
    let { allProductsQuery: { loading: curLoading } } = this.props

    if (curLoading !== newLoading && !newLoading && !newError) {
      let allProducts = nextProps.allProductsQuery.allProducts
      let { offset } = this.state

      let products = allProducts.products.map(data => {
        if (data.images.length > 0)
          return { ...data, image: data.images[0].url }
      })

      this.setState({
        products: [...this.state.products, ...products],
        offset: offset + MAX_FETCH_LENGTH,
        isFetchDisabled: this.state.products.length === allProducts.totalCount
      })
    }
  }

  componentDidMount() {
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
    let { allProductsQuery: { loading, refetch } } = this.props
    let { offset } = this.state

    if (loading) return
    if (scrollPosition < pageHeight - screenHeight - screenHeight * .1) return
    if (this.state.isFetchDisabled) return
    if (appStack.isPopupActive) return
    refetch({ limit: MAX_FETCH_LENGTH, offset })
  }

  state = {
    products: [],
    offset: 0,
    isFetchDisabled: false,
  }

  renderCards() {
    let { products } = this.state

    return products.map((data, i) => <Card favorites={favorites} {...data} key={i} data={data} />)
  }

  renderCategories() {
    let categories = categoriesStore.data

    if (!categories) return
    return _.map(categories, (data, i) => <Pills to={`/category/${i}`} label={i} key={i} />)
  }

  render() {
    let { allProductsQuery: { loading } } = this.props

    return (
      <TopBar
        relative={{
          title: { cart: true },
          search: { cart: false },
        }}

        fly={{
          search: { cart: true },
          mode: APPEAR
        }}

        isSelected={this.props.isSelected}
        style={{ background: 'rgb(239, 239, 239)' }}
      >
        <Separator>Categories</Separator>
        <div className={styles.categories} >
          {this.renderCategories()}
        </div>

        <Separator>All Products</Separator>
        {this.renderCards()}
        {
          loading
            ? <ProgressBar
              className={styles.loading} 
              type='circular' theme={ProgressBarTheme}
              mode='indeterminate'
            />
            : ''
        }
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

const allProductsQuery = gql`
query allProducts($limit: Int, $offset: Int) {
  allProducts(limit: $limit, offset: $offset) {
    products {
      id,
      name,
      price {
        value,
        currency
      },
      variants {
        name
      }
      images {
        url
      }
    }
    totalCount
  }
}
`

export default compose(
  graphql(allCategoriesQuery, {
    name: 'allCategoriesQuery',
    skip: () => categoriesStore.data === null
  }),
  graphql(allProductsQuery, {
    name: 'allProductsQuery',
    options: () => {
      return {
        variables: { limit: MAX_FETCH_LENGTH, offset: 0 }
      }
    }
  }),
)(Home)
//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { observer } from 'mobx-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import _ from 'lodash'

//STYLES
import styles from './css/index-search.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import Card from '../../components/ProductCard'

//STORE
import { categories as categoriesStore, appStack, favorites } from '../../services/stores'

//INNER_CONFIG
const MAX_FETCH_LENGTH = 5

const filters = [
  { value: 'termurah', label: 'Termurah' },
  { value: 'termahal', label: 'Termahal' },
  { value: 'terlama', label: 'Terlama' },
  { value: 'terbaru', label: 'Terbaru' },
]

//COMPONENT
@observer
class Search extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
    this.removeScrollListener()
  }

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
      this.updateProductsState(nextProps)
    }
  }

  updateProductsState(props) {
    let allProducts = props.allProductsQuery.allProducts
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

  category_name = ''

  componentDidMount() {
    if (!categoriesStore.data) this.fetchCategories()
    this.category_name = this.props.match.params.category_name

    if (this.props.allProductsQuery.allProducts) {
      this.updateProductsState(this.props)
    }

    this.addScrollListener()
  }

  addScrollListener() {
    window.addEventListener('scroll', this.checkScroll)
    window.addEventListener('gesturechange', this.checkScroll)
  }

  removeScrollListener() {
    window.removeEventListener('scroll', this.checkScroll)
    window.removeEventListener('gesturechange', this.checkScroll)
  }

  checkScroll = () => {
    let scrollPosition = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
    let pageHeight = document.body.scrollHeight
    let screenHeight = document.body.offsetHeight
    let { allProductsQuery: { loading } } = this.props

    //CHECKING FOR FETCHING ACCEPTANCE
    if (loading) return
    if (scrollPosition < pageHeight - screenHeight - screenHeight * .1) return
    if (this.state.isFetchDisabled) return

    //BE ABLE TO FETCH
    this.fetchProducts()
  }

  fetchProducts = () => {
    let { offset, filter, category, search } = this.state
    let sort = filter === 'termurah' || filter === 'termahal' ? 'price' : 'created'
    let order = filter === 'termurah' || filter === 'terlama' ? 'ASC' : 'DESC'
    this.props.allProductsQuery.refetch({
      limit: MAX_FETCH_LENGTH,
      offset, search, sort, order,
      category: category === 'all' ? this.category_name : category
    })
  }

  state = {
    products: [],
    offset: 0,
    isFetchDisabled: false,
    filter: 'terbaru', category: 'all', search: '',
  }

  handleChange(name, event) {
    this.setState({
      [name]: event.target.value,
      products: [],
      offset: 0,
      isFetchDisabled: false,
    }, () => {
      if (this.timeoutDelay !== null) clearTimeout(this.timeoutDelay)
      this.timeoutDelay = setTimeout(this.fetchProducts, 1000)
    })
  }

  timeoutDelay = null

  onClearClicked = () => {
    this.setState({ search: '' }, () => {
      if (this.timeoutDelay !== null) clearTimeout(this.timeoutDelay)
      this.timeoutDelay = setTimeout(this.fetchProducts, 1000)
    })
    this.searchBar.focus()
  }

  renderBar() {
    //if (window.navigator.userAgent.indexOf("Mac") == -1) 
    let { filter, category } = this.state
    let categories = categoriesStore.getConverted()

    if (!categories) return

    return <div className={styles.bar} key={0} >
      <div className={styles['filters-wrapper']} >

        <select
          name="filters" className={styles.filters}
          id="filters"
          value={filter}
          autoCapitalize="true" onChange={this.handleChange.bind(this, 'filter')}
        >
          {filters.map((data, i) => {
            return <option key={i} value={data.value}>{data.label}</option>
          })}
        </select>
        <span className={`mdi mdi-chevron-down ${styles.icon}`} />
      </div>

      <div className={styles['categories-wrapper']} >
        <select
          name="categories" className={styles.categories}
          id="categories"
          value={category}
          autoCapitalize="true" onChange={this.handleChange.bind(this, 'category')}
        >
          {_.map(categories, (data, i) => {
            return <option key={i} value={data.value}>{data.label}</option>
          })}
        </select>
        <span className={`mdi mdi-chevron-down ${styles.icon}`} />
      </div>
    </div>
  }

  renderCards() {
    let { products } = this.state

    return products.map((data, i) => <Card favorites={favorites} {...data} key={i} data={data} />)
  }

  render() {
    //let { loading } = this.state
    let { allProductsQuery: { loading } } = this.props
    let { products } = this.state

    return (
      <PopupBar
        title="Search" {...this.props}
        anim={ANIMATE_HORIZONTAL}
        style={{ background: 'rgb(239, 239, 239)' }}
        component={(
          <div className={styles.search} >
            <div className={styles.input}>
              <span className={`mdi mdi-magnify ${styles.icon}`} />
              <input
                type="text" placeholder="Mau belanja apa hari ini?"
                ref={el => this.searchBar = el}
                onChange={this.handleChange.bind(this, 'search')}
                value={this.state.search}
              />

              {
                this.state.search !== '' ?
                  <button className={styles.close} onClick={this.onClearClicked}>
                    <span>&times;</span></button>
                  : ''
              }
            </div>
            {/* <span className={styles.cancel} >Cancel</span> */}
          </div>
        )}
        anotherComponents={[
          this.renderBar()
        ]}
      >
        {this.renderCards()}
        {
          loading
            ? <ProgressBar
              className={styles.loading}
              type='circular'
              mode='indeterminate' multicolor
            />
            : products.length === 0
              ? <div className={styles['not-found']}>
                <span>Tidak ada produk yang ditemukan</span>
              </div> 
              : ''
        }
      </PopupBar>
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
query allProducts(
  $limit: Int, 
  $offset: Int, 
  $category: String, 
  $sort: String, 
  $order: PaginationOrderEnum,
  $search: String,
) {
  allProducts(
    limit: $limit, 
    offset: $offset, 
    category: $category,
    sort: $sort,
    order: $order,
    search: $search,
  ) {
    products {
      id,
      name,
      price {
        value,
        currency
      },
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
    options: ({ match }) => {
      let { params: { category_name } } = match

      return {
        variables: {
          limit: MAX_FETCH_LENGTH,
          offset: 0,
          category: category_name,
          order: 'DESC',
          sort: 'created'
        }
      }
    }
  }),
)(Search)
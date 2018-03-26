//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/index.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import TopBar, { HIDE } from '../../components/TopBar'
import PromoCard from '../../components/PromoCard'

//STORE
import { categories as categoriesStore, appStack, tokens } from '../../services/stores'

//INNER_CONFIG
const MAX_FETCH_LENGTH = 5

//COMPONENT
@observer
class Promo extends Component {
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
    let { activePromotionsQuery: { loading: newLoading, error: newError } } = nextProps
    let { activePromotionsQuery: { loading: curLoading } } = this.props

    if (curLoading !== newLoading && !newLoading && !newError) {
      let activePromotions = nextProps.activePromotionsQuery.activePromotions
      let { offset } = this.state

      this.setState({
        activePromotions: [...this.state.activePromotions, ...activePromotions.promotions],
        offset: offset + MAX_FETCH_LENGTH,
        isFetchDisabled: this.state.activePromotions.length === activePromotions.totalCount
      })
    } else if (newError) {
      tokens.refetchAPIToken().then(() => window.location.reload())
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
    let { activePromotionsQuery: { loading, refetch } } = this.props
    let { offset } = this.state

    if (loading) return
    if (scrollPosition < pageHeight - screenHeight - screenHeight * .1) return
    if (this.state.isFetchDisabled) return
    if (appStack.isPopupActive) return
    refetch({ limit: MAX_FETCH_LENGTH, offset })
  }

  state = {
    activePromotions: [],
    offset: 0,
    isFetchDisabled: false,
  }

  renderCards() {
    let { activePromotions } = this.state

    return activePromotions.map((data, i) =>
      <PromoCard
        {...data}
        key={i}
        to={`/promo/${data.id}`}
        data={data}
      />
    )
  }

  render() {
    let { activePromotionsQuery: { loading } } = this.props

    return (
      <TopBar
        fly={{
          title: { cart: true },
          mode: HIDE
        }}

        isSelected={this.props.isSelected}
        style={{ background: 'rgb(239, 239, 239)' }}
      >
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

const activePromotionsQuery = gql`
query activePromotions($limit: Int, $offset: Int) {
  activePromotions(limit: $limit, offset: $offset) {
    promotions {
      id
      title
      image
      begin
      end
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
  graphql(activePromotionsQuery, {
    name: 'activePromotionsQuery',
    options: () => {
      return {
        variables: { limit: MAX_FETCH_LENGTH, offset: 0 }
      }
    }
  }),
)(Promo)

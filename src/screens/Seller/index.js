//MODULES
import React, { Component, Fragment } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { withTracker } from '../../google-analytics'

//STYLES
import styles from './css/seller.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import FlatButton from '../../components/FlatButton'
import PrimaryButton from '../../components/PrimaryButton'
import Card from '../../components/ProductCard'
import Separator from '../../components/Separator'

//STORE
import { appStack, favorites, cart, snackbar } from '../../services/stores'

const MAX_FETCH_LENGTH = 5

@observer
class Seller extends Component{


  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount = () => {
    appStack.pop()
  }

  componentWillReceiveProps = (nextProps) => {
    this.checkAllProductsChange(nextProps)
    this.checkThisSellerInfoChange(nextProps)
    
  }

  checkAllProductsChange = (nextProps) => {
    let {
      allProductsQuery:{ loading: newLoading, error: newError }
    } = nextProps

    let {
      allProductsQuery:{ loading: currentLoading }
    } = this.props

    if (newLoading !== currentLoading && !newLoading && !newError){
      this.updateAndFetchSellerProducts(nextProps)
    } else if(newError){
      console.log('Error: ' + newError)
    }
  }

  state = {
    sellerProducts: [],
    name: null,
    profilePicture: null,
    offset: 0,
    isFetchDisabled: false,
    isShareActive: false,
    isLoadingImageError: false
  }

  checkThisSellerInfoChange = (nextProps) =>{
    let{
      sellerQuery: { loading: newSellerLoading, seller }
    } = nextProps

    let {
      sellerQuery: { loading: currSellerLoading }
    } = this.props

    if(newSellerLoading !== currSellerLoading && seller && !newSellerLoading){
      setTimeout(() => {
        this.setState({ name: seller.name, profilePicture: seller.profilePicture  })
      }, 100)
    }

  }

  componentDidMount = () => {
    let { sellerQuery:{ seller } } = this.props

    if(seller) this.setState({ name: seller.name, profilePicture: seller.profilePicture })

    this.updateAndFetchSellerProducts(this.props)
    this.before = this.current = document.documentElement.scrollTop
    window.scrollTo(0, 0)
    this.addScrollListener(this.props.isSelected)
    this.checkScroll()
  }
  

  updateAndFetchSellerProducts = (nextProps) => {
    let allProducts = nextProps.allProductsQuery.allProducts
    console.log('Products from props ' , allProducts)
    let { offset } = this.state

    if(!allProducts) return

    let sellerProducts = allProducts.products.map((products) => {
      if(products.images.length > 0)
        return { ...products, image: products.images[0].url }
    })

    this.setState({
      sellerProducts: [ ...sellerProducts ],
      offset: offset + MAX_FETCH_LENGTH,
      isFetchDisabled: this.state.sellerProducts.length === 5
    })

  }

  renderCards = () =>{
    let { sellerProducts } = this.state
    if(this.props.allProductsQuery.loading){
      return (
        <div className={styles.container}>
          <ProgressBar
            className={styles.loading}
            type='circular' theme={ProgressBarTheme}
            mode='indeterminate'
          />
        </div>
      )
    }
    console.log(sellerProducts)
    return sellerProducts.map((data, i ) => <Card favorites={favorites} {...data} key={i} data={data} />)
    
  }

  checkSelectedChanges(nextProps) {
    let isSelectedCurrent = nextProps.isSelected
    let isSelectedBefore = this.props.isSelected

    if (isSelectedCurrent != isSelectedBefore)
      this.addScrollListener(isSelectedCurrent)
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

  
  

  renderContent = () =>{  
    if (this.props.sellerQuery.loading)
      return (
        <div className={styles.container}>
          <ProgressBar
            className={styles.loading}
            type='circular' theme={ProgressBarTheme}
            mode='indeterminate'
          />
        </div>
      )

    let { name, address, city, zipCode, country, profilePicture } = this.props.sellerQuery.seller


    return(
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.photo}>
            {
              profilePicture 
                ? 
                <img src= {profilePicture}/> 
                : 
                <img style={{ width: '100px', height: '100px' }} src="https://openclipart.org/download/250353/icon_user_whiteongrey.svg" />
            }
          </div>
          <div className={styles.sellerName}>
            {(this.state.name ? this.state.name : name) + ' ' + '(' + country + ')'}
          </div>
          <span style={{ fontSize: '10pt', color: 'gray' }}>{address + ' - ' + city}</span>
          <div>Kode Pos: {zipCode} </div>
        </div>
        <Separator className={styles.separator} >Produk Yang Dijual</Separator>
        {this.renderCards()}
      </div>
    )
  }

  render(){
    return (
      <PopupBar
        title="Informasi Penjual" {...this.props}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
        cart
      />
    )
  }


}


const allProductsQuery = gql`
  query allProducts($sellerId: String){
    allProducts(sellerId: $sellerId){
      products{
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
          id,
          name,
          profilePicture,
          country
        },
        price {
          value,
          currency
        },
        country,
        liked,
        created,
        updated,
        shareUrl
      },
      totalCount
    }
  }
`

const sellerQuery = gql`
  query seller($sellerId: ID!){
    seller(sellerId: $sellerId){
      id,
      name,
      address,
      city,
      zipCode,
      country,
      profilePicture
    }
  }
`

export default withTracker(compose(
  graphql(
    allProductsQuery, {
      name: 'allProductsQuery',
      options: (props) => {
        return{
          variables :{ sellerId: props.match.params.seller_id }
        }
      }
    }
  ),
  graphql(
    sellerQuery, {
      name: 'sellerQuery',
      options: (props) => {
        return{
          variables :{ sellerId: props.match.params.seller_id }
        }
      }
    }
  )
)(Seller))





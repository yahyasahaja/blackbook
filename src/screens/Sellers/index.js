//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import gql from 'graphql-tag'
import { withTracker } from '../../google-analytics'
import { observable } from 'mobx'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import SellerListCard from '../../components/SellerListCard'

//STYLES
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'
import styles from './css/sellers.scss'

//STORE
import { appStack } from '../../services/stores'
import client from '../../services/graphql/productClient'

//COMPONENTs
@observer
class Sellers extends Component {
  //PROPERTIES
  @observable isFetchingSellers = false
  @observable allSellers = []

  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  componentDidMount() {
    this.fetchSellers()
  }

  async fetchSellers() {
    try {
      this.isFetchingSellers = true

      const {
        data: { allSellers },
      } = await client.query({
        query: allSellersQuery,
        // fetchPolicy: 'network-only'
      })

      this.allSellers = allSellers.sellers
    } catch (e) {
      console.log(e)
    }

    this.isFetchingSellers = false
  }

  state = {
    isLoadingImageError: false,
  }
  
  renderSellers() {
    if (this.isFetchingSellers) return (
      <ProgressBar
        className={styles.loading}
        type="circular"
        theme={ProgressBarTheme}
        mode="indeterminate"
      />
    )

    let finalSellers = this.allSellers.slice()
    return finalSellers.map((data, i) => {
      return (
        <SellerListCard 
          imageUrl={data.profilePicture} 
          url={`/seller/${data.id}`} 
          key={i} 
          name={data.name}
          className={styles.card}
          large
        />
      )
    })
  }

  renderContent = () => {
    return (
      <div className={styles.container} >
        {this.renderSellers()}
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title="Sellers" {...this.props}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
        cart
      />
    )
  }
}

const allSellersQuery = gql`
  query allSellers($limit: Int) {
    allSellers(limit: $limit) {
      sellers {
        id
        name
        profilePicture
      }
    }
  }
`

export default withTracker(Sellers)

//MODULES
import React, { Component } from 'react'
import gql from 'graphql-tag'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { Route } from 'react-router-dom'
import { observable, computed, action } from 'mobx'

//GRAPHQL
import client from '../../services/graphql/orderingClient'

//STYLES
import styles from './css/transaction.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import ScopeBar from '../../components/ScopeBar'
import TransactionList from '../../components/TransactionList'

//STORE
import { user, appStack } from '../../services/stores'

//ROUTER
import TransactionDetail from './TransactionDetail'
import TransactionPayment from './TransactionPayment'

//COMPONENT
@observer
class Transaction extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  STATUS_PROGRESS = 'status_progress'
  STATUS_COMPLETE = 'status_complete'
  FETCH_LIMIT = 5

  @observable myOrders = []
  @observable loadingMyOrders = false
  @observable status = this.STATUS_PROGRESS
  @observable offset = 0
  @observable totalCount = 1

  @computed
  get isAllFetched() {
    return this.offset > this.totalCount
  }

  @action
  reset() {
    this.offset = 0
    this.totalCount = 1
    this.myOrders = []
  }

  componentWillUnmount() {
    appStack.pop()
    this.removeScrollListener()
  }

  componentDidMount() {
    user.getProfilePictureURL()
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

    //CHECKING FOR FETCHING ACCEPTANCE
    if (this.loadingMyOrders) return
    if (scrollPosition < pageHeight - screenHeight - screenHeight * .1) return
    
    //BE ABLE TO FETCH
    this.fetchMyOrders(this.status)
  }

  async fetchMyOrders(status) {
    if (
      this.loadingMyOrders ||
      this.isAllFetched
    ) return
    console.log(status)
    try {
      this.loadingMyOrders = true
      
      if (status === this.STATUS_PROGRESS) status = ['UNPAID', 'PAID', 'PROGRESS']
      else status = ['COMPLETE']

      const {
        data: { myOrders },
      } = await client.query({
        query: retreiveTransactionData,
        variables: {
          offset: this.offset,
          status,
          limit: this.FETCH_LIMIT
        },
      })

      this.offset += this.FETCH_LIMIT
      this.totalCount = myOrders.totalCount
      this.myOrders = [ ...this.myOrders.slice(), ...myOrders.orders ]
      this.loadingMyOrders = false
    } catch (err) {
      console.log('Error while fetching my orders', err)
    }
  }

  onClick(status) {
    this.reset()
    this.fetchMyOrders(this.status = status)
  }

  scopeBarData = [
    {
      label: 'Proses',
      onClick: this.onClick.bind(this, this.STATUS_PROGRESS)
    },
    {
      label: 'Selesai',
      onClick: this.onClick.bind(this, this.STATUS_COMPLETE)
    }
  ]

  renderList() {
    if (this.myOrders.length > 0)
      return this.myOrders.slice().map((order, i) => {
        return <TransactionList history={this.props.history} key={i} order={order} />
      })
  }

  renderContent = () => {
    return (
      <div className={styles.container} >
        <div className={styles.list} >
          {this.renderList()}
        </div>
        {
          this.loadingMyOrders
            ? (
              <div className={styles.loading} >
                <ProgressBar
                  className={styles.loading}
                  type='circular' theme={ProgressBarTheme}
                  mode='indeterminate'
                />
              </div>
            )
            : ''
        }
        <div className={styles.scope} >
          <ScopeBar data={this.scopeBarData} />
        </div>
      </div>
    )
  }

  state = {
    myOrders: []
  }

  render() {
    appStack.stack
    this.status
    this.offset
    // console.log('STCK', appStack.stack.slice())
    return (
      <React.Fragment>
        <PopupBar
          onTop={appStack.stack[appStack.stack.length - 1] === this.id}
          title="Daftar Transaksi" {...this.props}
          renderContent={this.renderContent}
          backLink="/account"
          anim={ANIMATE_HORIZONTAL}
        />
        <Route
          path="/account/transaction/detail/:transaction_id"
          component={TransactionDetail}
        />
        <Route
          path="/account/transaction/payment/:transaction_id"
          component={TransactionPayment}
        />
      </React.Fragment>
    )
  }
}

const retreiveTransactionData = gql`
query RetrieveTransactionData($offset: Int, $limit: Int $status: [OrderStatusEnum!]) {
  myOrders(status: $status, order: DESC, limit: $limit, offset: $offset) {
    orders {
      id
      status
      time
      total
      country
      sellers {
        items {
          product {
            images {
              url
            }
          }
          price
          quantity
        }
      }
      payments {
        channel
      }
    }

    totalCount
  }
}
`

export default Transaction
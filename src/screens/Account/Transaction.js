//MODULES
import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import ProgressBar from 'react-toolbox/lib/progress_bar'

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

//COMPONENT
@observer
class Transaction extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  componentDidMount() {
    user.getProfilePictureURL()
    this.setState({ ...user.data })
  }

  onClick(status) {
    if (status === 'process') status = ['UNPAID', 'PAID', 'PROGRESS']
    else status = ['COMPLETE']
    
    this.props.retreiveTransactionData.refetch({
      offset: 0,
      status
    })
  }

  scopeBarData = [
    {
      label: 'Proses',
      onClick: this.onClick.bind(this, 'process')
    },
    {
      label: 'Selesai',
      onClick: this.onClick.bind(this, 'complete')
    }
  ]

  renderList() {
    let { myOrders, loading } = this.props.retreiveTransactionData
    
    if (loading) return (
      <div className={styles.loading} >
        <div>
          <ProgressBar
            className={styles.loading}
            type='circular'
            mode='indeterminate' theme={ProgressBarTheme}
          />
        </div>
      </div>
    )

    let { orders } = myOrders

    return orders.map((order, i) => {
      return <TransactionList history={this.props.history} key={i} order={order} />
    })
  }

  renderContent = () => {
    return (
      <div className={styles.container} >
        <div className={styles.list} >
          {this.renderList()}
        </div>
        <div className={styles.scope} >
          <ScopeBar data={this.scopeBarData} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title="Daftar Transaksi" {...this.props}
        renderContent={this.renderContent}
        backLink="/account"
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

const retreiveTransactionData = gql`
query RetrieveTransactionData($offset: Int, $status: [OrderStatusEnum!]) {
  myOrders(status: $status, order: DESC, limit: 10, offset: $offset) {
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
    }
  }
}
`

export default compose(
  graphql(retreiveTransactionData, {
    name: 'retreiveTransactionData',
    options: () => ({
      client,
      variables: {
        offset: 0,
        status: ['UNPAID', 'PAID', 'PROGRESS']
      }
    })
  }),
)(Transaction)
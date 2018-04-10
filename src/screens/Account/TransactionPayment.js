//MODULES
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ProgressBar from 'react-toolbox/lib/progress_bar'

//GRAPHQL
import client from '../../services/graphql/orderingClient'

//STYLES
import styles from './css/transaction-payment.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'

//UTILS
import { convertStatus, convertCountryCurrency } from '../../utils'

//COMPONENT
class TransactionPayment extends Component {
  renderList = () => {
    let {
      orderQuery: {
        loading,
        order
      }
    } = this.props

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

    return order.payments.map((payment, i) => (
      <div key={i} className={styles.list} >
        <div className={styles.left} >
          {convertStatus(payment.status)}
        </div>

        <div className={styles.right} >
          <div>{payment.code}</div>
          <div className={styles.amount} >
            {`${convertCountryCurrency(order.country)} ${payment.amount}`}
          </div>
        </div>
      </div>
    ))
  }

  renderContent = () => {
    return <div className={styles.container} >
      {this.renderList()}
    </div>
  }

  render() {
    return (
      <PopupBar
        title={`Pembayaran ${this.props.match.params.transaction_id}`} {...this.props}
        renderContent={this.renderContent}
        backLink="/account/transaction"
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

const orderQuery = gql`
query orderQuery($orderId: ID!) {
  order(orderId: $orderId) {
    id
    country
    payments {
      id
      url
      code
      expDate
      amount
      status
    }
  }
}
`
export default compose(
  graphql(orderQuery, {
    name: 'orderQuery',
    options: props => ({
      client,
      variables: {
        orderId: props.match.params.transaction_id
      }
    })
  })
)(TransactionPayment)
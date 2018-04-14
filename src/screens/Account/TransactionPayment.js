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
import PrimaryButton from '../../components/PrimaryButton'

//UTILS
import { convertStatus, convertCountryCurrency } from '../../utils'

//STORE
import { appStack, snackbar } from '../../services/stores'

//COMPONENT
class TransactionPayment extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  async openPopup(payment) {
    if (Date.now() > new Date(payment.expDate)) {
      try {
        this.setState({ renewLoading: payment.id })
        let { data: replaceOrderPayment } = await client.mutate({
          mutation: renewBarCode,
          variables: {
            orderPaymentId: payment.id
          }
        })

        if (replaceOrderPayment) this.props.orderQuery.refetch()
      } catch (e) {
        snackbar.show('Renew failed, please try again')
      }

      this.setState({ renewLoading: false })

    } else {
      this.timerToError = setTimeout(() => this.setState({errorIFrame: true}), 5000)
      this.setState({ popupUrl: payment.url.replace(/ /g,'') })
    }
  }

  renderList = () => {
    let {
      orderQuery: {
        loading,
        order
      }
    } = this.props

    let { renewLoading } = this.state

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
      <div
        key={i} className={styles.list}
        onClick={this.openPopup.bind(this, payment)}
      >
        <div className={styles.left} >
          {renewLoading === payment.id ? 'Loading ... ' : convertStatus(payment.status)}
          {
            Date.now() > new Date(payment.expDate)
              ? <PrimaryButton className={styles.renew} >Renew</PrimaryButton>
              : ''
          }
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

  renderContent() {
    let { popupUrl, errorIFrame } = this.state
    console.log('POPUPURL', popupUrl)
    return <div className={styles.container} >
      {this.renderList()}

      {
        popupUrl
          ? <div className={styles.popup} >
            <div className={styles.close} onClick={() => this.setState({ popupUrl: null })} >&times;</div>
            {
              errorIFrame
                ? <span className={styles.error} >An Error Occured</span>
                : <iframe
                  ref={el => this.iframe = el}
                  onLoad={e => {
                    console.log('TRIGGERED', e.target.innerHTML)
                    clearTimeout(this.timerToError)
                  }}
                  src={popupUrl}
                  frameBorder={0}
                />
            }
          </div>
          : ''
      }
    </div>
  }

  state = {
    popupUrl: null,
    errorIFrame: false,
    renewLoading: false,
  }

  render() {
    return (
      <PopupBar
        title={`Pembayaran ${this.props.match.params.transaction_id}`} {...this.props}
        renderContent={this.renderContent.bind(this)}
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

const renewBarCode = gql`
mutation renewBarCode($orderPaymentId: ID!) {
  replaceOrderPayment(orderPaymentId: $orderPaymentId) {
    id
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
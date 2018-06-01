//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Dialog from 'react-toolbox/lib/dialog'
import { observer } from 'mobx-react'

//GRAPHQL
import client from '../../services/graphql/orderingClient'

//STYLES
import styles from './css/transaction-detail.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import VerticalList from '../../components/VerticalList'
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import TransactionDetailCard from '../../components/TransactionDetailCard'
import PrimaryButton from '../../components/PrimaryButton'

//STORE
import { appStack } from '../../services/stores'

//UTILS
import { convertCountryCurrency, convertToMoneyFormat, convertStatus } from '../../utils'

//COMPONENT
@observer
class TransactionDetail extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  handleToggle = () => {
    this.setState({ active: !this.state.active })
  }

  confirmSeller = () => {
    let loc = this.state.currentConfirmSeller

    client.mutate({
      mutation: confirmOrder,
      variables: {
        orderSellerId: loc.id,
        input: {
          status: 'RECEIVED'
        }
      }
    }).then(() => this.props.getOrderQuery.refetch())

    this.setState({ active: false })
  }

  actions = [
    { label: 'Batal', onClick: this.handleToggle },
    { label: 'Konfirmasi', onClick: this.confirmSeller },
  ]

  confirm = seller => {
    this.setState({ active: true, currentConfirmSeller: seller })
  }

  state = {
    active: false,
    currentConfirmSeller: {},
    order: null,
    trackingUrl: null
  }

  trackOrder = trackingUrl => {
    this.setState({trackingUrl})
  }

  renderContent() {
    let {
      getOrderQuery: {
        order
      }
    } = this.props
    
    if (!order) return (
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
    
    let {
      id,
      status,
      shippingAddress,
      shippingImageUrl,
      shippingZipCode,
      shippingInfo,
      sellers,
      country,
      total
    } = order

    let list = [
      { key: 'Nomor Transaksi', value: id },
      {
        key: 'Status Transaksi', value: status !== 'UNPAID' ? convertStatus(status) : (
          <div className={styles.status} >
            {convertStatus(status)}
            <PrimaryButton 
              className={styles.pay}
              to={`/account/transaction/payment/${id}`} 
            >Bayar</PrimaryButton>
          </div>
        )
      },
      { key: 'Alamat', value: (
        <div>
          <div>{shippingAddress}</div>
          <div>{shippingZipCode}</div>
          {
            shippingImageUrl
              ? <div className={styles.img} ><img src={shippingImageUrl} alt=""/></div>
              : ''
          }

          {
            shippingInfo
              ? <div>{shippingInfo}</div>
              : ''
          }
        </div>
      ) },
      {
        key: 'Total Pembayaran', value: convertToMoneyFormat(total, convertCountryCurrency(country))
      },
      {
        key: 'Daftar Barang', value: sellers.map(
          (s, i) => <TransactionDetailCard
            onConfirm={() => this.confirm(s)}
            key={i} seller={s}
            trackOrder={this.trackOrder}
          />
        )
      }
    ]

    return (
      <div className={styles.container} >
        <div className={styles.info} >
          {list.map((data, i) => {
            return <VerticalList key={i} dataKey={data.key} value={data.value} />
          })}
        </div>
      </div>
    )
  }

  render() {
    console.log(!this.state.trackingUrl)
    return (
      <React.Fragment>
        <PopupBar
          title="Detil Transaksi" {...this.props}
          renderContent={this.renderContent.bind(this)}
          backLink="/account/transaction"
          anim={ANIMATE_HORIZONTAL}
          onTop={!this.state.trackingUrl}
        />
        {
          this.state.currentConfirmSeller.seller
            ? <Dialog
              actions={this.actions}
              active={this.state.active}
              onEscKeyDown={this.handleToggle}
              onOverlayClick={this.handleToggle}
              title='Perbarui Kata Sandi'
            >
              <p>Anda akan melakukan konfirmasi telah menerima barang dari {
                this.state.currentConfirmSeller.seller.name
              }
              </p>
            </Dialog>
            : ''
        }

        {
          this.state.trackingUrl
            ? <div className={styles.popup} >
              <div className={styles.close} onClick={() => this.setState({ trackingUrl: null })} >&times;</div>
              <iframe
                ref={el => this.iframe = el}
                // onLoad={e => {
                //   console.log('TRIGGERED', e.target.innerHTML)
                //   clearTimeout(this.timerToError)
                // }}
                src={this.state.trackingUrl}
                frameBorder={0}
              />
            </div>
            : ''
        }
      </React.Fragment>
    )
  }
}

const getOrderQuery = gql`
query getOrder($orderId: ID!) {
  order(orderId: $orderId) {
    id
    shippingAddress
    shippingZipCode
    shippingImageUrl
    shippingInfo
    discount
    status
    country
    total
    payments {
      status
    }
    sellers {
      id
      status
      trackingUrl
      seller {
        id
        name
      }
      items {
        product {
          id
          name
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
`

const confirmOrder = gql`
mutation ConfirmReceviedGoods($orderSellerId: ID!, $input: OrderSellerStatusInput!) {
  updateOrderSellerStatus(orderSellerId: $orderSellerId, input: $input) {
    id
  }
}
`

export default compose(
  graphql(getOrderQuery, {
    name: 'getOrderQuery',
    options: props => ({
      client,
      variables: {
        orderId: props.match.params.transaction_id
      },
      fetchPolicy: 'cache-and-network'
    }),
  }),
)(TransactionDetail)
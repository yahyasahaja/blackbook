//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Dialog from 'react-toolbox/lib/dialog'

//GRAPHQL
import client from '../../services/graphql/orderingClient'

//STYLES
import styles from './css/transaction-detail.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import VerticalList from '../../components/VerticalList'
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import TransactionDetailCard from '../../components/TransactionDetailCard'

//STORE
import { appStack } from '../../services/stores'

//COMPONENT
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

    this.props.confirmOrder({
      variables: {
        orderSellerId: loc.id,
        input: {
          status: 'RECEIVED'
        }
      }
    })
    
    this.setState({active: false})
  }

  actions = [
    { label: 'Batal', onClick: this.handleToggle },
    { label: 'Konfirmasi', onClick: this.confirmSeller },
  ]

  confirm = seller => {
    this.setState({active: true, currentConfirmSeller: seller})
  }

  state = {
    active: false,
    currentConfirmSeller: {}
  }

  renderContent = () => {
    let {
      getOrderQuery: {
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

    let {
      id,
      status,
      shippingAddress,
      sellers,
      country
    } = order

    let list = [
      { key: 'Nomor Transaksi', value: id },
      {
        key: 'Status Transaksi', value: status === 'COMPLETE'
          ? 'LUNAS'
          : status === 'UNPAID'
            ? 'BELUM LUNAS'
            : status === 'PAID'
              ? 'SUDAH LUNAS'
              : 'DALAM PROSES'
      },
      { key: 'Alamat', value: shippingAddress },
      {
        key: 'Total Pembayaran', value: `${
          country === 'TWN'
            ? 'NTD'
            : country === 'HKG'
              ? 'HKD'
              : 'Rp'
        } ${sellers.reduce((prev, cur) => {
          return prev + cur.items.reduce((prev, cur) => {
            return prev + cur.price + cur.quantity
          }, 0)
        }, 0)
        }`
      },
      {
        key: 'Daftar Barang', value: sellers.map(
          (s, i) => <TransactionDetailCard 
            onConfirm={() => this.confirm(s)} 
            key={i} seller={s} 
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
    console.log(this.state.currentConfirmSeller)
    return (
      <React.Fragment>
        <PopupBar
          title="Transaction Detail" {...this.props}
          renderContent={this.renderContent}
          backLink="/account/transaction"
          anim={ANIMATE_HORIZONTAL}
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
    discount
    status
    country
    payments {
      status
    }
    sellers {
      id
      status
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
  graphql(confirmOrder, {
    name: 'confirmOrder',
    options: {
      client
    }
  }),
  graphql(getOrderQuery, {
    name: 'getOrderQuery',
    options: props => ({
      client,
      variables: {
        orderId: props.match.params.transaction_id
      }
    })
  }),
)(TransactionDetail)
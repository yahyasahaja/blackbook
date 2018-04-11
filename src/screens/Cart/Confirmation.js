import React, { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import axios from 'axios'

import ProgressBar from 'react-toolbox/lib/progress_bar'

import { convertToMoneyFormat } from '../../utils'

import { appStack, user, cart } from '../../services/stores'

import PopupBar from '../../components/PopupBar'
import PrimaryButton from '../../components/PrimaryButton'
import ConfirmationItem from '../../components/Cart/ConfirmationItem'

import orderingClient from '../../services/graphql/orderingClient'
import userClient from '../../services/graphql/userClient'

// styles
import styles from './css/confirmation.scss'
import loadingTheme from './css/loading.scss'
import theme from '../../assets/css/theme.scss'

@observer
class Process extends Component {
  constructor(props) {
    super(props)

    this.id = appStack.push()
  }

  state = {
    loading: false,
  }

  componentWillMount() {
    if (
      !user.isLoggedIn ||
      !this.props.location.state ||
      !this.props.location.state.shippingCost
    ) {
      this.props.history.replace('/cart')
      return
    }
  }

  componentWillUnmount() {
    appStack.pop()
  }

  // address section
  renderAddress() {
    const { type, address } = this.props.location.state

    return (
      <div className={styles.section}>
        <p className={styles.title}>ALAMAT</p>
        {type !== 'foto' && (
          <p>
            {address.address}
            <br />
            {address.city}
            <br />
            {address.country + ' ' + address.zip_code}
          </p>
        )}
        {type === 'foto' && (
          <Fragment>
            <img className={styles.foto} src={address.img} />
            <p>{address.information}</p>
          </Fragment>
        )}
      </div>
    )
  }

  // channel section
  renderChannel() {
    const { channel } = this.props.location.state

    const logo = {
      HILIFETW: 'https://paygw.azureedge.net/images/hilifelogo.png',
      FAMILYTW: 'https://paygw.azureedge.net/images/familogo.png',
    }

    return (
      <div className={styles.section}>
        <p className={styles.title}>CHANNEL PEMBAYARAN</p>
        <div>
          <img src={logo[channel]} />
        </div>
        <p>Tunjukan barcode pembayaran yang akan anda terima kepada kasir</p>
      </div>
    )
  }

  // product section
  renderProduct() {
    return (
      <div className={styles.section}>
        <p className={styles.title}>DAFTAR PRODUK</p>
        {cart.data
          .slice()
          .map((item, index) => (
            <ConfirmationItem
              key={`${item.product.id}-${item.variant}`}
              index={index}
              {...item}
            />
          ))}
      </div>
    )
  }

  // total section
  renderTotal() {
    return (
      <div className={styles.section}>
        <div className={styles.price}>
          <span>Total Harga Barang</span>
          <span>{convertToMoneyFormat(cart.totalPrice, 'NTD')}</span>
        </div>
        <div className={styles.price}>
          <span>Ongkos Kirim</span>
          <span>
            {convertToMoneyFormat(
              this.props.location.state.shippingCost,
              'NTD',
            )}
          </span>
        </div>
        <div className={`${styles.price} ${styles.total}`}>
          <span>Total</span>
          <span>
            {convertToMoneyFormat(
              cart.totalPrice + this.props.location.state.shippingCost,
              'NTD',
            )}
          </span>
        </div>

        {cart.totalPrice > 20000 && (
          <p>
            Anda akan mendapatkan lebih dari satu barkode pembayaran (nominal
            diatas NTD 20000)
          </p>
        )}
      </div>
    )
  }

  async continue() {
    this.setState({ loading: true })
    const { type, address, saveNewAddress, channel } = this.props.location.state

    // create card
    const { data: { createCart: cartData } } = await orderingClient.mutate({
      mutation: CreateCart,
      variables: {
        input: {
          items: cart.data.slice().map(item => ({
            productId: item.product.id,
            variant: item.variant,
            quantity: item.amount,
          })),
        },
      },
    })

    // create order
    const { data: { createOrderFromCart: orderData } } = await orderingClient.mutate({
      mutation: CreateOrderFromCart,
      variables: {
        cartId: cartData.id,
        input: {
          shippingType: type === 'foto' ? 'IMAGE' : 'TEXT',
          shippingAddress: type === 'foto' ? null : `${address.address}, ${address.city}, ${address.country}`,
          shippingZipCode: type === 'foto' ? null : address.zip_code,
          shippingInfo: type === 'foto' ? address.information : null,
        }
      }
    })
  }

  async uploadImage(targetUrl) {
    const { address } = this.props.location.state

    try {
      const reader = new FileReader()
      reader.onloadend = async function(ev) {
        await axios.put(targetUrl, ev.target.result, {
          headers: {
            'content-type': address.foto.file.type,
            'x-ms-blob-type': 'BlockBlob',
          },
        })
      }
      await reader.readAsArrayBuffer(self.newFoto.file)
    } catch (e) {
      console.log(e)
    }
  }

  async createOrder() {}

  render() {
    return (
      <PopupBar
        // anim={ANIMATE_HORIZONTAL}
        onBack={e => {
          e.preventDefault()
          if (!this.state.loading) {
            this.props.history.goBack()
          }
        }}
        title="Konfirmasi Pembelian"
        {...this.props}
        style={{
          background: 'rgb(239, 239, 239)',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 88,
          paddingTop: 56,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this.renderAddress()}
        {this.renderChannel()}
        {this.renderProduct()}
        {this.renderTotal()}
        <div className={`${styles.section} ${styles.action}`}>
          <div
            className={`${styles.actionButton} ${
              this.state.loading ? styles.hide : ''
            }`}
          >
            <PrimaryButton
              disabled={this.state.loading}
              onClick={() => this.props.history.goBack()}
              className={styles.cancelButton}
            >
              BATAL
            </PrimaryButton>
            <PrimaryButton
              disabled={this.state.loading}
              onClick={() => this.continue()}
              className={styles.buyButton}
            >
              KONFIRMASI
            </PrimaryButton>
          </div>
          <div
            className={`${styles.loading} ${
              this.state.loading ? styles.shown : ''
            }`}
          >
            <ProgressBar
              theme={loadingTheme}
              type="circular"
              mode="indeterminate"
            />
            <span>Memproses pesanan anda</span>
          </div>
        </div>
      </PopupBar>
    )
  }
}

const CreateCart = gql`
  mutation CreateCart($input: CartInput) {
    createCart(input: $input) {
      id
    }
  }
`

export const CreateOrderFromCart = gql`
  mutation CreateOrderFromCart($cartId: ID!, $input: OrderFromCartInput!) {
    createOrderFromCart(cartId: $cartId, input: $input) {
      id
      shippingImageUrl
    }
  }
`

export default Process

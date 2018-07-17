import React, { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import gql from 'graphql-tag'
import axios from 'axios'
import { graphql } from 'react-apollo'
import { withTracker } from '../../google-analytics'
import ReactGA from 'react-ga'

import ProgressBar from 'react-toolbox/lib/progress_bar'

import { convertToMoneyFormat, convertCountryCurrency } from '../../utils'

import { appStack, user, cart, snackbar, info } from '../../services/stores'

import config from '../../config'

import PopupBar from '../../components/PopupBar'
import PrimaryButton from '../../components/PrimaryButton'
import ConfirmationItem from '../../components/Cart/ConfirmationItem'

import orderingClient from '../../services/graphql/orderingClient'
import userClient from '../../services/graphql/userClient'

// styles
import styles from './css/confirmation.scss'
import loadingTheme from './css/loading.scss'

@observer
class Process extends Component {
  constructor(props) {
    super(props)

    this.id = appStack.push()
  }

  state = {
    loading: false
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
          <p data-testid="address-detail">
            {address.address}
            <br />
            {address.city}
            <br />
            {address.country + ' ' + address.zip_code}
          </p>
        )}
        {type === 'foto' && (
          <Fragment>
            <img
              data-testid="address-image"
              className={styles.foto}
              src={address.img}
            />
            <p data-testid="address-information">{address.information}</p>
          </Fragment>
        )}
      </div>
    )
  }

  renderChannelDetail() {
    const { channel } = this.props.location.state

    const logo = {
      HILIFETW: 'https://paygw.azureedge.net/images/hilifelogo.png',
      FAMILYTW: 'https://paygw.azureedge.net/images/familogo.png',
      AS2IN1WAL: 'http://as2in1mobile.com/images/As2in1-Mobile-logo.png'
    }

    let { getUser, loading } = this.props.user

    let as2in1Wallet = ''
    if (getUser) as2in1Wallet = getUser.as2in1Wallet

    if (channel === 'AS2IN1WAL')
      return (
        <div className={styles['e-wallet-channel']}>
          <img
            className={cart.channel === 'AS2IN1WAL' ? styles.as2in1 : ''}
            data-testid="channel-logo"
            data-channel={channel}
            src={logo[channel]}
          />

          <span className={styles.balance}>
            {loading
              ? 'Loading...'
              : as2in1Wallet
                ? convertToMoneyFormat(as2in1Wallet, 'HKD')
                : 0}
          </span>
        </div>
      )

    return (
      <div className>
        <img
          data-testid="channel-logo"
          data-channel={channel}
          src={logo[channel]}
        />
      </div>
    )
  }

  // channel section
  renderChannel() {
    return (
      <div className={styles.section}>
        <p className={styles.title}>CHANNEL PEMBAYARAN</p>
        {this.renderChannelDetail()}
        {user.data && user.data.country !== 'HKG' && (
          <p>Tunjukan barcode pembayaran yang akan anda terima kepada kasir</p>
        )}
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
    let currency = user.data
      ? convertCountryCurrency(user.data.country)
      : config.COUNTRY_CODE

    console.log(user.data)
    return (
      <div className={styles.section}>
        <div className={styles.price}>
          <span>Total Harga Barang</span>
          <span>{convertToMoneyFormat(cart.totalPrice, currency)}</span>
        </div>
        <div className={styles.price}>
          <span>Ongkos Kirim</span>
          <span>
            {convertToMoneyFormat(
              this.props.location.state.shippingCost,
              currency
            )}
          </span>
        </div>
        {this.props.location.state.discount > 0 && (
          <div className={styles.price}>
            <span>Potongan</span>
            <span>
              {'- ' +
                convertToMoneyFormat(
                  this.props.location.state.discount,
                  currency
                )}
            </span>
          </div>
        )}
        <div className={`${styles.price} ${styles.total}`}>
          <span>Total</span>
          <span data-testid="confirmation-total">
            {convertToMoneyFormat(
              cart.totalPrice +
                this.props.location.state.shippingCost -
                this.props.location.state.discount,
              currency
            )}
          </span>
        </div>

        {cart.totalPrice > 20000 &&
          (user.data && user.data.country) !== 'HKG' && (
            <p>
              Anda akan mendapatkan lebih dari satu barkode pembayaran (nominal
              diatas NTD 20.000)
            </p>
          )}
      </div>
    )
  }

  async continue() {
    const { type, saveNewAddress } = this.props.location.state

    this.setState({ loading: true })

    ReactGA.plugin.execute('ec', 'confirmToBuy', {
      ...this.props.location.state
    })
    ReactGA.plugin.execute('ec', 'send')
    ReactGA.plugin.execute('ec', 'clear')

    // create cart + order
    const orderData = await this.createOrder()
    if (orderData === null) {
      this.setState({ loading: false })
      return
    }

    // upload image
    if (type === 'foto') {
      await this.uploadImage(orderData.shippingImageUrl)
    }

    // save new address
    if (saveNewAddress) {
      await this.saveNewAddress()
    }

    // create payment
    await this.createPayment(orderData.id)
    this.setState({ loading: false })

    // reset cart and go to transaction page
    cart.clear()
    this.props.history.push(`/account/transaction/detail/${orderData.id}`)
  }

  async uploadImage(targetUrl) {
    const { address } = this.props.location.state

    try {
      const reader = new FileReader()
      reader.onloadend = async function(ev) {
        await axios.put(targetUrl, ev.target.result, {
          headers: {
            'content-type': address.foto.type,
            'x-ms-blob-type': 'BlockBlob'
          },
          transformRequest: [
            (data, headers) => {
              delete headers.Authorization
              return data
            }
          ]
        })
      }
      await reader.readAsArrayBuffer(address.foto)
    } catch (e) {
      console.log(e.response)
    }
  }

  async createOrder() {
    const { type, address, voucherCode } = this.props.location.state

    try {
      // create cart
      const items = cart.data.slice().map(item => ({
        productId: item.product.id,
        variant: item.variant,
        quantity: item.amount
      }))

      const {
        data: { createCart: cartData }
      } = await orderingClient.mutate({
        mutation: CreateCart,
        variables: {
          input: {
            promotionCode: voucherCode,
            items
          }
        }
      })

      // create order
      const {
        data: { createOrderFromCart: orderData }
      } = await orderingClient.mutate({
        mutation: CreateOrderFromCart,
        variables: {
          cartId: cartData.id,
          input: {
            shippingType: type === 'foto' ? 'IMAGE' : 'TEXT',
            shippingAddress:
              type === 'foto'
                ? null
                : `${address.address}, ${address.city}, ${address.country}`,
            shippingZipCode: type === 'foto' ? null : address.zip_code,
            shippingInfo: type === 'foto' ? address.information : null
          }
        }
      })

      return orderData
    } catch (err) {
      console.log(err)
      snackbar.show(
        'Gagal memproses pesanan anda, mohon ulangi kembali.',
        'Tutup',
        null,
        4000
      )
      return null
    }
  }

  async createPayment(orderId) {
    const { channel, channelName } = this.props.location.state

    try {
      const {
        data: { addOrderPayment: paymentDetail }
      } = await orderingClient.mutate({
        mutation: AddOrderPayment,
        variables: {
          orderId: orderId,
          input: {
            channel
          }
        }
      })

      // create payment sukses
      if (paymentDetail.payments.length > 0) {
        snackbar.show(
          `Order berhasil, silahkan melakukan pembayaran sejumlah ${convertToMoneyFormat(
            paymentDetail.total,
            convertCountryCurrency(paymentDetail.country)
          )} melalui ${channelName}`,
          null,
          null,
          7000
        )
      }
    } catch (err) {
      console.log('ERROR AT CREATING PAYMENT', err)
      if (user.data && user.data.country === 'HKG')
        info.show('Order berhasil, silahkan melakukan pembayaran.')
      return null
    }
  }

  async saveNewAddress() {
    const { address } = this.props.location.state
    try {
      await userClient.mutate({
        mutation: SaveUserAddress,
        variables: {
          addressDetail: {
            user_id: 0,
            ...address
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

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
          flexDirection: 'column'
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

export const AddOrderPayment = gql`
  mutation AddOrderPayment($orderId: ID!, $input: OrderPaymentInput!) {
    addOrderPayment(orderId: $orderId, input: $input) {
      id
      country
      total
      payments {
        url
        code
      }
    }
  }
`

const SaveUserAddress = gql`
  mutation SaveUserAddress($addressDetail: OtherAddressInput!) {
    mutateAddress(addressDetail: $addressDetail) {
      id
    }
  }
`

const getUserDataQuery = gql`
  query UserData {
    getUser {
      as2in1Wallet
    }
  }
`

export default withTracker(
  graphql(getUserDataQuery, {
    name: 'user',
    options: {
      client: userClient
    }
  })(Process)
)

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observe } from 'mobx'
import gql from 'graphql-tag'
import Checkbox from 'react-toolbox/lib/checkbox'
import Input from 'react-toolbox/lib/input/Input'
import Dialog from 'react-toolbox/lib/dialog'
import { withTracker } from '../../google-analytics'

import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import { appStack, cart, user } from '../../services/stores'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import CartItem from '../../components/Cart/CartItem'
import { convertToMoneyFormat, convertCountryCurrency } from '../../utils'

import client from '../../services/graphql/orderingClient'

import config from '../../config'

import styles from './css/index.scss'
import theme from '../../assets/css/theme.scss'
import checkBoxTheme from './css/checkbox.scss'
import inputTheme from './css/inputVoucher.scss'

@observer
class Cart extends Component {
  isUnmounted = false

  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  state = {
    loginAlert: false,
    shippingCost: null,
    useVoucher: false,
    voucherCode: '',
    productCost: null,
    discount: 0,
    error: '',
  }

  componentDidMount() {
    cart.refreshData()

    // this.calculateTotalCost()
    this.disposer = observe(cart.data, () => {
      this.calculateTotalCost()
    })

    // wait until user data loaded
    this.userDisposer = observe(user, 'isLoading', () => {
      console.log('creating listener')
      if (!user.isLoading) {
        this.calculateTotalCost()
      }
    }, true)
  }

  componentWillUnmount() {
    this.isUnmounted = true
    this.disposer()
    appStack.pop()
  }

  get totalPrice() {
    return (this.state.productCost || cart.totalPrice) 
      + (this.state.shippingCost || 0) 
      - (this.state.useVoucher ? this.state.discount : 0)
  }

  async calculateTotalCost() {
    this.setState({ shippingCost: null, discount: 0, error: '' })
    const { useVoucher, voucherCode } = this.state

    const input = cart.data.slice().map(item => ({
      productId: item.product.id,
      quantity: item.amount,
    }))

    const country = user.data ? user.data.country : config.COUNTRY_CODE
    
    try {
      const { data: { calcTotalCost: { productCost, shippingCost, discount } }} = await client.mutate({
        mutation: calculateCost,
        variables: {
          input: {
            country,
            items: input,
            promotionCode: useVoucher ? voucherCode : '',
          },
        },
      })

      if (!this.isUnmounted)
        this.setState({ 
          shippingCost,
          productCost,
          discount: discount === null ? 0 : discount,
          error: discount === null ? 'Silahkan cek kembali kode voucher anda!' : '',
        })
    } catch (err) {
      if (!this.isUnmounted)
        this.setState({ 
          discount: 0, 
          error: 'Silahkan cek kembali kode voucher anda!' 
        })
      console.log(err)
    }

    this.userDisposer()
  }

  renderProducts() {
    return (
      <div
        data-testid="cart-list"
        className={`${styles.products} 
        ${this.state.useVoucher && styles.padded}
        ${this.state.error && styles.error}
        ${this.state.useVoucher && this.state.discount > 0 && styles.discount}`}
      >
        {cart.data
          .slice()
          .map((item, index) => (
            <CartItem
              key={`${item.product.id}-${item.variant}`}
              index={index}
              {...item}
              history={this.props.history}
            />
          ))}
      </div>
    )
  }

  checkIsLoggedIn() {
    // show alert if not logged in
    if (!user.isLoggedIn) {
      this.setState({ loginAlert: true })
      return
    }

    // continue if logged in
    this.props.history.push('/cart/process', {
      shippingCost: this.state.shippingCost,
      discount: this.state.discount,
      voucherCode: this.state.error ? '' : this.state.voucherCode,
    })
  }

  renderDetail() {
    let currency = convertCountryCurrency(user.data ? user.data.country : config.COUNTRY_CODE)
    return (
      <div data-testid="cart-detail" className={styles.detail}>
        <div className={styles.row}>
          <span className={styles.info}>Ongkos Kirim</span>
          <span data-testid="cart-shipping-cost" data-shipping-cost={this.state.shippingCost} className={styles.amount}>
            {this.state.shippingCost
              ? convertToMoneyFormat(this.state.shippingCost, currency)
              : 'Menghitung ongkos kirim...'}
          </span>
        </div>
        {this.state.useVoucher && this.state.discount > 0 && <div className={styles.row}>
          <span className={styles.info}>Potongan</span>
          <span data-testid="discount" data-discount={this.state.discount} className={styles.amount}>
            {'- ' + convertToMoneyFormat(this.state.discount, currency)}
          </span>
        </div>}
        <div className={styles.row}>
          <span className={styles.info}>Total Pembayaran</span>
          <span data-testid="cart-total" data-total={this.totalPrice} className={styles.amount}>
            {convertToMoneyFormat(this.totalPrice, currency)}
          </span>
        </div>
        <div className={`${styles.row} ${styles.voucher}`}>
          <Checkbox
            theme={checkBoxTheme}
            checked={this.state.useVoucher}
            label="Saya ingin menggunakan kupon belanja"
            onChange={() =>
              this.setState({ useVoucher: !this.state.useVoucher })
            }
          />
          {this.state.useVoucher && (
            <div>
              <div className={styles.voucherInput}>
                <Input
                  theme={{ ...theme, ...inputTheme }}
                  type="text"
                  hint="Kode Voucher"
                  value={this.state.voucherCode}
                  onChange={val => this.setState({ voucherCode: val })}
                />
                <SecondaryButton
                  onClick={() => this.calculateTotalCost()}
                  className={styles.voucherButton}
                >
                GUNAKAN
                </SecondaryButton>
              </div>
              { this.state.error && <p className={styles.error}>{this.state.error}</p> }
            </div>
          )}
        </div>
        <PrimaryButton
          disabled={this.state.shippingCost === null}
          onClick={() => this.checkIsLoggedIn()}
          className={styles.buyButton}
        >
          LANJUTKAN
        </PrimaryButton>
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        anim={ANIMATE_HORIZONTAL}
        onBack={e => {
          e.preventDefault()
          this.props.history.goBack()
        }}
        title="Keranjang Belanja"
        {...this.props}
        style={{
          background: 'rgb(239, 239, 239)',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingTop: 56,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Dialog
          actions={[
            {
              label: 'login',
              onClick: () => {
                this.setState({ loginAlert: false })
                this.props.history.push('/auth/login')
              },
            },
          ]}
          active={this.state.loginAlert}
          onEscKeyDown={() => this.setState({ loginAlert: false })}
          onOverlayClick={() => this.setState({ loginAlert: false })}
        >
          <p>Silahkan login terlebih dahulu untuk melakukan transaksi</p>
        </Dialog>

        {cart.data.length === 0 && (
          <p data-testid="cart-message" className={styles.empty}>
            Keranjang belanja anda masih kosong
            <span className="mdi mdi-cart-outline" />
          </p>
        )}
        {this.renderProducts()}
        {cart.data.length > 0 && this.renderDetail()}
      </PopupBar>
    )
  }
}

const calculateCost = gql`
  mutation calculateCost($input: CalcTotalCostInput!) {
  	calcTotalCost(input: $input) {
      productCost
      shippingCost
      discount
      total
    }
  }
`

export default withTracker(Cart)
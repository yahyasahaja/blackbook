import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observe } from 'mobx'
import gql from 'graphql-tag'
import Checkbox from 'react-toolbox/lib/checkbox'
import Input from 'react-toolbox/lib/input/Input'
import Dialog from 'react-toolbox/lib/dialog'

import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import { appStack, cart, user } from '../../services/stores'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import CartItem from '../../components/Cart/CartItem'
import { convertToMoneyFormat } from '../../utils'

import client from '../../services/graphql/orderingClient'

import styles from './css/index.scss'
import theme from '../../assets/css/theme.scss'
import checkBoxTheme from './css/checkbox.scss'
import inputTheme from './css/inputVoucher.scss'

@observer
export default class Cart extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  state = {
    loginAlert: false,
    shippingCost: null,
    useVoucher: false,
    voucherCode: '',
  }

  componentDidMount() {
    this.calculateShippingCost()
    this.disposer = observe(cart.data, () => {
      this.calculateShippingCost()
    })
  }

  componentWillUnmount() {
    this.disposer()
    appStack.pop()
  }

  async calculateShippingCost() {
    this.setState({ shippingCost: null })

    // CalcShippingCostTwnInput form
    const input = cart.data.slice().map(item => ({
      productId: item.product.id,
      quantity: item.amount,
    }))

    try {
      const { data: { calcShippingCostTwn } } = await client.mutate({
        mutation: calculateShippingCostTaiwan,
        variables: {
          input: {
            items: input,
          },
        },
      })
      this.setState({ shippingCost: calcShippingCostTwn })
    } catch (err) {
      console.log(err)
    }
  }

  renderProducts() {
    return (
      <div
        data-testid="cart-list"
        className={`${styles.products} ${this.state.useVoucher &&
          styles.padded}`}
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
    })
  }

  renderDetail() {
    return (
      <div data-testid="cart-detail" className={styles.detail}>
        <div className={styles.row}>
          <span className={styles.info}>Ongkos Kirim</span>
          <span data-testid="cart-shipping-cost" data-shipping-cost={this.state.shippingCost} className={styles.amount}>
            {this.state.shippingCost
              ? convertToMoneyFormat(this.state.shippingCost, 'NTD')
              : 'Menghitung ongkos kirim...'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.info}>Total Pembayaran</span>
          <span className={styles.amount}>
            {convertToMoneyFormat(
              cart.totalPrice + (this.state.shippingCost || 0),
              'NTD',
            )}
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
            <div className={styles.voucherInput}>
              <Input
                theme={{ ...theme, ...inputTheme }}
                type="text"
                hint="Kode Voucher"
                value={this.state.voucherCode}
                onChange={val => this.setState({ voucherCode: val })}
              />
              <SecondaryButton
                onClick={() => {}}
                className={styles.voucherButton}
              >
                GUNAKAN
              </SecondaryButton>
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

const calculateShippingCostTaiwan = gql`
  mutation CalcShippingCost($input: CalcShippingCostInput!) {
    calcShippingCostTwn(input: $input)
  }
`

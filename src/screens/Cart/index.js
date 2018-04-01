import React, { Component } from 'react'
import { observer } from 'mobx-react'
import gql from 'graphql-tag'
import Checkbox from 'react-toolbox/lib/checkbox'
import Input from 'react-toolbox/lib/input/Input'

import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import { appStack, cart } from '../../services/stores'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import CartItem from '../../components/Cart/CartItem'
import { convertToMoneyFormat } from '../../utils'

import client from '../../services/graphql/orderingClient'

import styles from './css/index.scss'
import theme from '../../assets/css/theme.scss'
import checkBoxTheme from './css/checkbox.scss'
import inputTheme from './css/input.scss'

@observer
export default class Cart extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  state = {
    shippingCost: null,
    useVoucher: false,
    voucherCode: '',
  }

  componentDidMount() {
    this.calculateShippingCost()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  async calculateShippingCost() {
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
      <div className={`${styles.products} ${this.state.useVoucher && styles.padded}`}>
        {cart.data
          .slice()
          .map((item, index) => (
            <CartItem
              key={`${item.product.id}-${item.variant}`}
              index={index}
              {...item}
            />
          ))}
      </div>
    )
  }

  renderDetail() {
    return (
      <div className={styles.detail}>
        <div className={styles.row}>
          <span className={styles.info}>Ongkos Kirim</span>
          <span className={styles.amount}>
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
                type="Masukkan Kode Voucher"
                hint="Kode Voucher"
                value={this.state.voucherCode}
                onChange={val => this.setState({ voucherCode: val })}
              />
              <SecondaryButton
                onClick={() => { }}
                className={styles.voucherButton}
              >
                GUNAKAN
              </SecondaryButton>
            </div>
          )}
        </div>
        <PrimaryButton
          disabled={this.state.shippingCost === null}
          onClick={() => { }}
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
        {cart.data.length === 0 && (
          <p className={styles.empty}>
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

//MODULES
import { observable, action, computed } from 'mobx'
import badges from './Badges'
import ImagePlaceholder from '../../assets/img/image-placeholder.jpeg'
import ReactGA from 'react-ga'

import { CART_STORAGE_URI } from '../../config'

import user from './User'
import overlayLoading from './OverlayLoading'
import snackbar from './Snackbar'

import client from '../graphql/orderingClient'
import gql from 'graphql-tag'

//STORE
class Cart {
  constructor() {
    this.fetchData()
  }

  @observable id = null
  @observable items = []
  @observable cartData = {}
  @observable address = 'none'
  @observable channelIndex = 'none'
  @observable channel = 'none'
  @observable channelName = 'none'
  @observable addressList = []
  @observable saveNewAddress = false
  @observable isLoading = false
  @observable
  newAddress = {
    address: '',
    city: '',
    zip_code: '',
    country: 'TWN'
  }
  @observable addressFoto = ImagePlaceholder
  @observable addressFotoFile = ''
  @observable addressFotoInformation = ''
  @observable shippingCost = 0

  @action
  async fetchData() {
    if (user && user.isLoggedIn) {
      try {
        this.isLoading = true
        overlayLoading.show()
        const { 
          data: {
            myCarts: { totalCount, carts}
          } 
        } = await client.query({
          query: myCarts,
          variables: {
            status: 'DRAFT'
          }
        })
  
        this.isLoading = false
        overlayLoading.hide()
  
        if (totalCount > 0) {

          this.items = carts[0].items.map(data => {
            data = { ...data }
            data.product = { ...data.product }
            if (data.product.images.length > 0) 
              data.product.image = data.product.images[0].url

            data.amount = data.quantity

            return data
          })
          this.id = carts[0].id
        }

        //TODO: merge if local exist
        badges.set(badges.CART, this.items.length)
        console.log(this.items.slice(), this.id)
      } catch (e) {
        console.log('ERROR WHILE FETCHING CART DRAFT', e)
      }
      
      return
    }

    let carts
    if ((carts = localStorage.getItem(CART_STORAGE_URI))) {
      this.items = JSON.parse(carts)
      badges.set(badges.CART, this.items.length)
    }
  }

  @computed
  get isDraftExist() {
    return this.id != null && this.id != 'null'
  }

  @action
  async add(arg) {
    let state = this.items.slice()

    // check if already exists
    const index = state.findIndex(
      item => item.product.id === arg.product.id && item.variant === arg.variant
    )
    if (index !== -1) {
      // update amount
      const updated = state[index]
      updated.amount = Number(updated.amount) + Number(arg.amount)
      state.splice(index, 1, updated)
    } else {
      state.push(arg)
    }

    //REACT GA
    ReactGA.plugin.execute('ec', 'addToCart', {
      ...arg
    })
    ReactGA.plugin.execute('ec', 'send')
    ReactGA.plugin.execute('ec', 'clear')

    //FINISHING
    this.items.replace(state)
    if (await this.updateCart()) snackbar.show('Barang ditambahkan ke keranjang')
    badges.set(badges.CART, this.items.length)

    if (!user.isLoggedIn) localStorage.setItem(CART_STORAGE_URI, JSON.stringify(state))
  }

  async updateCart(voucherCode) {
    if (!user || !user.isLoggedIn) return

    const items = this.items.slice().map(item => ({
      productId: item.product.id,
      variant: item.variant,
      quantity: Number(item.amount)
    }))

    this.isLoading = true
    overlayLoading.show()

    try {
      const {
        data: { result }
      } = await client.mutate({
        mutation: this.isDraftExist ? updateCart : createCart,
        variables: {
          cartId: this.id,
          input: {
            promotionCode: voucherCode === '' ? null : voucherCode,
            items
          }
        }
      })
      this.isLoading = false
      overlayLoading.hide()

      if (result && result.id) this.id = result.id
      return true
    } catch(e) {
      this.isLoading = false
      overlayLoading.hide()
      return false
    }
  }

  @action
  async remove(index) {
    let state = this.items.slice()

    state.splice(index, 1)

    this.items.replace(state)
    badges.set(badges.CART, this.items.length)
    await this.updateCart()

    if (!user.isLoggedIn) localStorage.setItem(CART_STORAGE_URI, JSON.stringify(state))
  }

  @action
  clear() {
    this.items.clear()
    badges.set(badges.CART, 0)
    localStorage.removeItem(CART_STORAGE_URI)
  }

  @computed
  get totalPrice() {
    return this.items
      .slice()
      .reduce(
        (total, item) => total + item.product.price.value * (item.amount || item.quantity),
        0
      )
  }
}

const myCarts = gql`
  query myCarts($status: CartStatusEnum) {
    myCarts(status: $status) {
      carts {
        id
        status
        items {
          product {
            id
            name
            price {
              value
              currency
            }
            variants {
              name
            }
            images {
              url
            }
            shareUrl
          }
          variant
          quantity
        }
      }
      totalCount
    }
  }
`

const createCart = gql`
  mutation createCart($input: CartInput!) {
    createCart(input: $input) {
      id
    }
  }
`

const updateCart = gql`
  mutation updateCart($cartId: ID!, $input: CartInput!) {
    updateCart(cartId: $cartId, input: $input) {
      id
    }
  }
`

export default window.cart = new Cart()

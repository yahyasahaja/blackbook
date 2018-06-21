//MODULES
import { observable, action, computed } from 'mobx'
import badges from './Badges'
import ImagePlaceholder from '../../assets/img/image-placeholder.jpeg'

import { CART_STORAGE_URI } from '../../config'

//STORE
class Cart {
  constructor() {
    let carts
    if ((carts = localStorage.getItem(CART_STORAGE_URI))) {
      this.data = JSON.parse(carts)
      badges.set(badges.CART, this.data.length)
    }
  }

  @observable data = []
  @observable address = 'none'
  @observable channelIndex = 'none'
  @observable channel = 'none'
  @observable channelName = 'none'
  @observable addressList = []
  @observable saveNewAddress = false
  @observable
  newAddress = {
    address: '',
    city: '',
    zip_code: '',
    country: 'TWN',
  }
  @observable addressFoto = ImagePlaceholder
  @observable addressFotoFile = ''
  @observable addressFotoInformation = ''
  @observable shippingCost = 0;

  @action
  add(arg) {
    let state = this.data.slice()

    // check if already exists
    const index = state.findIndex(
      item =>
        item.product.id === arg.product.id && item.variant === arg.variant,
    )
    if (index !== -1) {
      // update amount
      const updated = state[index]
      updated.amount = Number(updated.amount) + Number(arg.amount)
      state.splice(index, 1, updated)
    } else {
      state.push(arg)
    }

    this.data.replace(state)
    badges.set(badges.CART, this.data.length)

    localStorage.setItem(CART_STORAGE_URI, JSON.stringify(state))
  }

  @action
  remove(index) {
    let state = this.data.slice()

    state.splice(index, 1)

    this.data.replace(state)
    badges.set(badges.CART, this.data.length)

    localStorage.setItem(CART_STORAGE_URI, JSON.stringify(state))
  }

  @action
  clear() {
    this.data.clear()
    badges.set(badges.CART, 0)
    localStorage.setItem(CART_STORAGE_URI, JSON.stringify([]))
  }

  @computed
  get totalPrice() {
    return this.data
      .slice()
      .reduce(
        (total, item) => total + item.product.price.value * item.amount,
        0,
      )
  }
}

export default new Cart()

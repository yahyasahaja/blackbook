//MODULES
import { observable, action } from 'mobx'
import badges from './Badges'

//STORE
class Cart {
  @observable data = []

  @action
  add(arg) {
    let state = this.data.slice()
    state.push(arg)
    this.data.replace(state)
    badges.set(badges.CART, this.data.length)
  }

  @action
  remove(index) {
    let state = this.data.slice()
    
    state.splice(index, 1)

    this.data.replace(state)
    badges.set(badges.CART, this.data.length)
  }
}

export default new Cart()
//MODULES
import { observable, action } from 'mobx'

//STORE
class OverlayLoading {
  @observable 
  isActive = false

  @action
  toggleisActive = () => {
    this.isActive = !this.isActive
  }

  @action
  show = () => {
    this.isActive = true
  }

  @action
  hide = () => {
    this.isActive = false
  }
}

export default new OverlayLoading()
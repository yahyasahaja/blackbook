//MODULES
import { observable, action, computed } from 'mobx'

//STORE
class Popup {
  @observable stackLength = 0
  
  @action
  push() {
    this.stackLength++
  }

  @action
  pop() {
    if (this.stackLength > 0) this.stackLength--
  }

  @action
  reset() {
    this.stackLength = 0
  }

  @computed
  get isPopupActive() {
    return this.stackLength !== 0
  }
}

export default new Popup()
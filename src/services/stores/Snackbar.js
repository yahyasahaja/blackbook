//MODULES
import { observable, action } from 'mobx'

//STORE
class Snackbar {
  @observable 
  data = {
    active: false,
    action: 'Dismiss',
    label: 'Snackbar action cancel',
    type: 'cancel',
  }

  @action
  show(label, action, type) {
    let state = this.data

    this.data = observable({
      active: true,
      action: action || state.action,
      label: label || state.label,
      type: type || state.type,
    })
  }

  @action
  hide() {
    let state = this.data

    this.data = observable({
      ...state,
      active: false,
    })
  }
}

export default new Snackbar()
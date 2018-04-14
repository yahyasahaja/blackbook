//MODULES
import { observable, action } from 'mobx'

//STORE
class OnlineStatus {
  @observable isOnline = true

  @action
  goOnline = () => {
    this.isOnline = true
  }

  @action
  goOffline = () => {
    this.isOnline = false
  }
}

export default new OnlineStatus()

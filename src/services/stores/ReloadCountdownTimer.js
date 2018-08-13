//MODULES
import { observable, action } from 'mobx'

//COMPONENT
class ReloadCoundownTimer {
  MAX_COUNT_DOWN = 10
  @observable countDown = this.MAX_COUNT_DOWN
  @observable shouldReload = false

  reload() {
    this.countDown = this.MAX_COUNT_DOWN
    this.shouldReload = true
    this.intervalId = setInterval(() => {
      if (--this.countDown <= 0) this.refreshPage()
    }, 1000)
  }

  @action
  refreshPage() {
    window.location.reload()
  }
}

export default new ReloadCoundownTimer()
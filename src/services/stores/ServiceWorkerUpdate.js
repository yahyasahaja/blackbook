//MODULES
import { observable, action } from 'mobx'

//STORE
class ServiceWorkerUpdate {
  @observable shouldUpdate = false
  @observable countDown = 5
  @observable intervalId = null

  @action
  update() {
    this.countDown = 5
    this.shouldUpdate = true
    this.intervalId = setInterval(() => {
      if (--this.countDown <= 0) this.refreshPage()
    }, 1000)
  }

  refreshPage() {
    window.location.reload()
  }
}

export default new ServiceWorkerUpdate()
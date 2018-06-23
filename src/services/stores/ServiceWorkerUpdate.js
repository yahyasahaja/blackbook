//MODULES
import { observable, action, computed } from 'mobx'
import { asyncComponent } from '../../components/AsyncComponent'

//STORE
class ServiceWorkerUpdate {
  @observable shouldUpdate = false
  @observable countDown = 5
  @observable intervalId = null
  @observable promptInstall = null
  @observable showPrompt = false

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

  @action
  setPrompt(value) {
    this.promptInstall = value
    if (value) {
      setTimeout(() => {
        this.showPrompt = true
      }, 10000)
    }
  }

  @action
  installPrompt() {
    if (this.promptInstall) this.promptInstall.prompt()
  }

  @action
  setShowPrompt(value) {
    this.showPrompt = value
  }

  @computed
  get shouldShowPrompt() {
    return this.showPrompt
  }
}

export default new ServiceWorkerUpdate()

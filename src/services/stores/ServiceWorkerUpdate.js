//MODULES
import { observable, action } from 'mobx'

//STORE
class ServiceWorkerUpdate {
  @observable shouldUpdate = false
  @observable countDown = 5
  @observable intervalId = null
  @observable promptInstall = null
  @observable showPrompt = false
  @observable cancellable = false
  @observable showManualGuide = false
  @observable showCheckbox = true

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
    this.showPrompt = true
    console.log(value, this.showPrompt)
  }

  @action
  installPrompt() {
    console.log('install prompt triggerred')
    if (this.promptInstall) {
      console.log(this.promptInstall)
      this.promptInstall.prompt()
      this.promptInstall.userChoice.then(choice => {
        if (choice.outcome === 'accepted') console.log('INSTALLING APP')
        else {
          console.log('INSTALLING APP REJECTED')
          this.setManualGuide(true, true)
        }
        this.promptInstall = null
      })
    }
  }

  @action
  setShowPrompt(value) {
    console.log(value)
    this.showPrompt = value
  }

  @action
  setCancellable(value) {
    this.cancellable = value
  }

  @action
  setManualGuide(value, hidden = null) {
    this.showManualGuide = value
    if (hidden) this.showCheckbox = false
  }
}

export default new ServiceWorkerUpdate()

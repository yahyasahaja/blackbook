//MODULES
import { observable, action } from 'mobx'

//STORE
class Info {
  @observable text = ''
  @observable isActive = false
  @observable forcedToClose = false
  @observable isGone = true
  @observable currentId = 0
  TIME = 2000

  @action
  show = (text, time = this.TIME) => {
    this.text = text
    this.isGone = true
    clearTimeout(this.currentId)

    setTimeout(() => {
      this.isGone = false
      this.isActive = true

      this.currentId = setTimeout(() => {
        this.hide()
      }, time)
    }, 100)
  }

  @action
  hide = () => {
    // this.forcedToClose = false
    this.isActive = false

    setTimeout(() => {
      this.isGone = true
    }, 300)
  }
}

export default new Info()
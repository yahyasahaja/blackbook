//MODULES
import { observable, action } from 'mobx'

//STORE
class Dialog {
  @observable 
  active = false

  actions = []
  title = 'Dialog'
  onEscKeyDown = null
  onOverlayClick = null
  content = null

  @action
  toggleActive = () => {
    this.active = !this.active
  }

  @action
  show = (title, content, actions) => {
    this.active = true
    this.content = content
    this.actions = actions
    this.title = title
    this.onEscKeyDown = this.toggleActive
    this.onOverlayClick = this.toggleActive
  }

  @action
  hide = () => {
    let state = this.data

    this.data = observable({
      ...state,
      active: false,
    })
  }
}

export default new Dialog()
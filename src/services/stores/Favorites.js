//MODULES
import { observable, action } from 'mobx'
import badges from './Badges'

//STORE
class Favorites {
  @observable data = []

  @action
  add(arg) {
    let state = this.data.slice()
    for (let i in state) if (state[i].id == arg.id) return
    (state = state.slice()).push(arg)
    this.data.replace(state)
    badges.set(badges.LIKED, this.data.length)
  }

  @action
  remove(id) {
    let state = this.data.slice()
    
    for (let i in state) if (state[i].id == id) {
      state.splice(i, 1)
      break
    }

    this.data.replace(state)
    badges.set(badges.LIKED, this.data.length)
  }
}

export default new Favorites()
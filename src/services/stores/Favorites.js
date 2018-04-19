//MODULES
import { observable, action } from 'mobx'
import badges from './Badges'

//STORE
class Favorites {
  constructor() {
    try {
      let favorites = window.localStorage.getItem('favorites')
      favorites = JSON.parse(favorites)
      
      if (favorites) {
        this.data = observable(favorites)
        badges.set(badges.LIKED, this.data.length)
      }
    } catch (e) {
      console.log('ERROR AT FAVORITES CONSTRUCTOR', e)
    }
  }

  @observable data = []

  @action
  add(arg) {
    let state = this.data.slice()
    for (let i in state) if (state[i].id == arg.id) return
    (state = state.slice()).push(arg)
    this.data.replace(state)
    badges.set(badges.LIKED, this.data.length)
    window.localStorage.setItem('favorites', JSON.stringify(state))
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
    window.localStorage.setItem('favorites', JSON.stringify(state))
  }
}

export default new Favorites()
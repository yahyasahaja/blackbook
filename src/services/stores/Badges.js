//MODULES
import { observable, action } from 'mobx'

//STORE
class Badges {
  @observable data = { something: 1 }

  CART = 'cart'
  LIKED = 'liked'
  CHAT = 'chat'

  @action
  set(key, value) {
    this.data = observable({...this.data, [key]: value})
  }

  @action
  reset(key) {
    this.data = observable({...this.data, [key]: 0})
  }

  @action
  inc(key) {
    if (this.data[key]) this.data = observable({...this.data, [key]: this.data[key] + 1})
    else this.data = observable({...this.data, [key]: 1})
  }

  @action
  dec(key) {
    if (this.data[key]) this.data = observable({...this.data, [key]: this.data[key] - 1})
    else this.data = observable({...this.data, [key]: 1})
  }
}
 
// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default window.badges = new Badges()
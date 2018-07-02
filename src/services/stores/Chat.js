//MODULES
import { observable } from 'mobx'

//STORE
class Chat {
  @observable threads = observable.array()
}

export default new Chat()
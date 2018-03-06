//MODULES
import { observable } from 'mobx'

//STORE
class Selected {
  @observable data = {}

  getById(id) {
    return this.data[id]
  }
}

export default new Selected()
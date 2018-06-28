<<<<<<< HEAD
//MODULES
import { observable, action, computed } from 'mobx'

//STORE
class AppStack {
  @observable stack = []
  id = 0
  
  @action
  push() {
    this.stack.push(++this.id)
    return this.id
  }

  @action
  pop() {
    let id
    if (this.stack.length > 0) id = this.stack[this.stack.length - 1]
    this.stack.pop()
    return id
  }

  @action
  reset() {
    this.stack = observable([])
  }

  @computed
  get isPopupActive() {
    return this.stack.length !== 0
  }

  @action
  isAtTop(id) {
    if (this.stack.length > 0) return this.stack[this.stack.length - 1] == id
    return false
  }
}

=======
//MODULES
import { observable, action, computed } from 'mobx'

//STORE
class AppStack {
  @observable stack = []
  id = 0
  
  @action
  push() {
    this.stack.push(++this.id)
    return this.id
  }

  @action
  pop() {
    let id
    if (this.stack.length > 0) id = this.stack[this.stack.length - 1]
    this.stack.pop()
    return id
  }

  @action
  reset() {
    this.stack = observable([])
  }

  @computed
  get isPopupActive() {
    return this.stack.length > 0
  }

  @action
  isAtTop(id) {
    if (this.stack.length > 0) return this.stack[this.stack.length - 1] == id
    return false
  }
}

>>>>>>> 4f5493570e5ec7c1d7a6ccdb968addf3a8445826
export default window.appStack = new AppStack()
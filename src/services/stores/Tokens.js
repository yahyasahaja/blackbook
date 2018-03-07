//MODULES
import { observable, computed } from 'mobx'
import axios from 'axios'

import {
  getIAMEndpoint,
  API_TOKEN_STORAGE_URI,
} from '../../config'

//STORE
class Tokens {
  constructor() {
    //INIT_TOKENS
    let apiToken

    if ((apiToken = localStorage.getItem(API_TOKEN_STORAGE_URI)))
      this.apiToken = observable(apiToken)
    else 
      axios.get(getIAMEndpoint('/token')).then(res => {
        if (res.data) {
          let token = res.data.toString()
          localStorage.setItem(API_TOKEN_STORAGE_URI, token)
          this.apiToken = observable(token)
        }
      })
  }

  @observable apiToken = null
  @observable authToken = null

  //USE THIS FOR AUTHORIZATION
  @computed
  get token() {
    return this.authToken || this.apiToken
  }
}
 
// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default new Tokens()
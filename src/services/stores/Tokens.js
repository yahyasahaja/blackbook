//MODULES
import { observable, computed, action } from 'mobx'
import axios from 'axios'

import {
  getIAMEndpoint,
  API_TOKEN_STORAGE_URI,
  AUTHORIZATION_TOKEN_STORAGE_URI,
} from '../../config'

//STORE
class Tokens {
  constructor() {
    //INIT_TOKENS
    let apiToken, authToken

    if ((apiToken = localStorage.getItem(API_TOKEN_STORAGE_URI)))
      this.apiToken = observable(apiToken)
    else
      this.refetchAPIToken()

    if ((authToken = localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI))) {
      this.authToken = observable(authToken)
      this.setAuthToken(authToken)
    } else this.setAuthToken()
  }

  //THIS MUST BE RAW TOKEN, NO BEARER!
  @observable apiToken = null
  @observable authToken = null

  //USE THIS FOR AUTHORIZATION
  @computed
  get token() {
    let raw = this.rawToken
    return raw ? `Bearer ${raw}` : null
  }

  @computed
  get rawToken() {
    if (
      this.authToken === null ||
      this.authToken == 'undefined' || 
      this.authToken == 'null'
    ) return this.apiToken
    
    return this.authToken
  }

  @action
  async refetchAPIToken() {
    let hkg = location.host.indexOf('hktest') !== -1 || location.host.indexOf('.hk') !== -1
    let { data } = await axios.get(getIAMEndpoint(`/token${hkg ? '/hk' : ''}`))

    if (data) {
      let token = data.toString()
      localStorage.setItem(API_TOKEN_STORAGE_URI, token)
      this.apiToken = observable(token)
      axios.defaults.headers['Authorization'] = `Bearer ${this.token}`
      return data
    }

    return this.refetchAPIToken()
  }

  @action
  setAuthToken(token) {
    this.authToken = token || this.rawToken
    
    localStorage.setItem(AUTHORIZATION_TOKEN_STORAGE_URI, this.authToken)
    axios.defaults.headers['Authorization'] = `Bearer ${this.authToken}`
    return this.authToken
  }

  @action
  removeAuthToken() {
    this.authToken = null
    if (this.token) axios.defaults.headers['Authorization'] = this.token
    else delete axios.defaults.headers['Authorization']
    
    localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
  }

  @action
  removeAPIToken() {
    this.apiToken = null
    delete axios.defaults.headers['Authorization']
    
    localStorage.removeItem(API_TOKEN_STORAGE_URI)
  }
}

// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default window.tokens = new Tokens()
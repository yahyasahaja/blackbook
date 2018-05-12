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

    this.setAuthToken()

    if ((authToken = localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)))
      this.authToken = observable(authToken)
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
    if (this.authToken == 'undefined' || this.authToken == 'null') return this.apiToken
    return this.authToken
  }

  @action
  async refetchAPIToken() {
    let { data } = await axios.get(getIAMEndpoint('/token'))

    if (data) {
      let token = data.toString()
      localStorage.setItem(API_TOKEN_STORAGE_URI, token)
      this.apiToken = observable(token)
      this.setAuthToken()
      return data
    }

    return this.refetchAPIToken()
  }

  @action
  setAuthToken(token) {
    this.authToken = token || this.rawToken
    axios.defaults.headers['Authorization'] = `Bearer ${token}`
    localStorage.setItem(AUTHORIZATION_TOKEN_STORAGE_URI, token)
    return token
  }

  @action
  removeAuthToken() {
    this.authToken = null
    if (this.token) axios.defaults.headers['Authorization'] = this.token
    else delete axios.defaults.headers['Authorization']
    
    localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
  }
}

// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default window.tokens = new Tokens()
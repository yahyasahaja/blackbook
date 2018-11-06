//MODULES
import { observable, computed, action } from 'mobx'
import axios from 'axios'

import {
  AUTHORIZATION_TOKEN_STORAGE_URI
} from '../../config'

import { setAxiosAuthorization } from '../../utils'

//STORE
class Token {
  constructor() {
    //INIT_TOKENS
    this.fetchAuthTokenFromLocalStorage()
  }

  fetchAuthTokenFromLocalStorage() {
    let authToken
    if ((authToken = localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI))) {
      this.rawAuthToken = observable(authToken)
      this.setAuthToken(authToken)
    }
  }

  //THIS MUST BE RAW TOKEN, NO BEARER!
  @observable rawAuthToken = null

  //USE THIS FOR AUTHORIZATION
  @computed
  get bearerToken() {
    let raw = this.rawAuthToken
    return raw ? `Bearer ${raw}` : null
  }

  @action
  setAuthToken(token) {
    if (!token) return
    this.rawAuthToken = token
    
    localStorage.setItem(AUTHORIZATION_TOKEN_STORAGE_URI, token)
    setAxiosAuthorization(token)
    return token
  }

  @action
  removeAuthToken() {
    this.rawAuthToken = null
    delete axios.defaults.headers['Authorization']
    
    localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
  }
}

// autorun(() => console.log('DARI AUTORUN', window.badges.data))
window.axios = axios
export default window.tokens = new Token()
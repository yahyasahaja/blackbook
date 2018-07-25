//MODULES
import { observable, computed, action } from 'mobx'
import axios from 'axios'

import {
  getIAMEndpoint,
  API_TOKEN_STORAGE_URI,
  AUTHORIZATION_TOKEN_STORAGE_URI,
} from '../../config'

import { setAxiosAuthorization } from '../../utils'

//STORE
class Tokens {
  constructor() {
    //INIT_TOKENS
    let apiToken, authToken

    if ((apiToken = localStorage.getItem(API_TOKEN_STORAGE_URI)))
      this.rawApiToken = observable(apiToken)
    else
      this.refetchAPIToken()

    if ((authToken = localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI))) {
      this.rawAuthToken = observable(authToken)
      this.setAuthToken(authToken)
    } else this.setAuthToken()
  }

  //THIS MUST BE RAW TOKEN, NO BEARER!
  @observable rawApiToken = null
  @observable rawAuthToken = null
  @observable forgotPasswordToken = null

  //USE THIS FOR AUTHORIZATION
  @computed
  get bearerToken() {
    let raw = this.rawToken
    return raw ? `Bearer ${raw}` : null
  }

  @computed
  get rawToken() {
    if (
      this.rawAuthToken === null ||
      this.rawAuthToken == 'undefined' || 
      this.rawAuthToken == 'null'
    ) return this.rawApiToken
    
    return this.rawAuthToken
  }

  @action
  async refetchAPIToken() {
    let hkg = location.host.indexOf('hktest') !== -1 || location.host.indexOf('.hk') !== -1
    let { data } = await axios.get(getIAMEndpoint(`/token${hkg ? '/hk' : ''}`))

    if (data) {
      let token = data.toString()
      localStorage.setItem(API_TOKEN_STORAGE_URI, token)
      this.rawApiToken = observable(token)
      console.log('ke sini kah?', token)
      setAxiosAuthorization(token)
      return data
    }

    return await this.refetchAPIToken()
  }

  @action
  setAuthToken(token) {
    this.rawAuthToken = token

    localStorage.setItem(AUTHORIZATION_TOKEN_STORAGE_URI, token)
    setAxiosAuthorization(token)
    return token
  }

  @action
  setForgotPasswordToken(token){
    this.forgotPasswordToken = token
    return this.forgotPasswordToken
  }

  @action
  removeForgotPasswordToken() {
    this.forgotPasswordToken = null
  }
  

  @action
  removeAuthToken() {
    this.rawAuthToken = null
    console.log('REMOVING AUTH TOKEN', this.rawApiToken)
    if (this.rawApiToken) setAxiosAuthorization(this.rawApiToken)
    else delete axios.defaults.headers['Authorization']
    
    localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
  }

  @action
  removeAPIToken() {
    this.rawApiToken = null
    delete axios.defaults.headers['Authorization']
    
    localStorage.removeItem(API_TOKEN_STORAGE_URI)
  }
}

// autorun(() => console.log('DARI AUTORUN', window.badges.data))
window.axios = axios
export default window.tokens = new Tokens()
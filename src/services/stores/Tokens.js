//MODULES
import { observable, computed, action } from 'mobx'
import axios from 'axios'

import {
  getIAMEndpoint,
  API_TOKEN_STORAGE_URI,
  AUTHORIZATION_TOKEN_STORAGE_URI,
  SELECTED_COUNTRY_STORAGE_URI
} from '../../config'

import { setAxiosAuthorization } from '../../utils'

//STORE
class Tokens {
  constructor() {
    //INIT_TOKENS
    let apiToken, authToken
    
    this.refetchAPIToken()

    if ((authToken = localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI))) {
      this.rawAuthToken = observable(authToken)
      this.setAuthToken(authToken)
    }
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

  @computed
  get country() {
    if (
      this.rawApiToken !== null ||
      this.rawApiToken != 'undefined' || 
      this.rawApiToken != 'null'
    ) {
      if (this.rawApiToken.value.indexOf('SESSTWN') != -1) return 'twn'
      return 'hkg'
    }
  }

  @action
  async refetchAPIToken() {
    let hkg = (
      location.host.indexOf('hktest') !== -1 || 
      location.host.indexOf('.hk') !== -1 ||
      localStorage.getItem(SELECTED_COUNTRY_STORAGE_URI) === 'hkg'
    )

    console.log('KE SINI GA SIH', hkg)
    let { data } = await axios.get(getIAMEndpoint(`/token${hkg ? '/hk' : ''}`))

    if (data) {
      let token = data.toString()
      localStorage.setItem(API_TOKEN_STORAGE_URI, token)
      this.rawApiToken = observable(token)
      // console.log('ke sini kah?', token)
      setAxiosAuthorization(token)
      return data
    }

    return await this.refetchAPIToken()
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
  setForgotPasswordToken(token){
    return this.forgotPasswordToken = token
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
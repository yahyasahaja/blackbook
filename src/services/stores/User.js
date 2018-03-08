//MODULES
import { observable, action, computed } from 'mobx'
import axios from 'axios'

//CONFIG
import {
  getIAMEndpoint,
  AUTHORIZATION_TOKEN_STORAGE_URI,
} from '../../config'

//TOKENS
import tokens from './Tokens'

//STORE
class User {
  constructor() {
    //INIT_USER_DATA
    this.fetchData()
  }

  @observable data = null
  @observable isLoading

  @action
  setData = data => {
    return this.data = observable(data)
  }

  @action
  login = (msisdn, password) => {
    this.isLoading = true
    
    axios.post(getIAMEndpoint('/login'), {
      msisdn,
      password
    }).then(({ is_ok, data: token }) => {
      
      this.isLoading = false
  
      if (is_ok) {
        this.fetchData(token)
        return tokens.authToken = token
      }

      return false
    })
  }

  @action
  logout = () => {
    this.data = null
    tokens.authToken = null
    localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
  }

  @action
  fetchData = token => {
    let authToken = token || localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)
    
    if (authToken) return new Promise((resolve) => resolve(false))
    this.isLoading = true
    return axios.get(getIAMEndpoint('/user'))
      .then(({data: { is_ok, data: user } }) => {
        console.log(is_ok, user)
        this.isLoading = false
        if (is_ok) {
          tokens.authToken = authToken
          return this.setData(user)
        }

        localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
        return false
      }).catch(res => {
        console.log('FETCH USER ERROR', res)
        return false
      })
  }

  @computed
  get isLoggedIn() {
    return !!this.data
  }
}
 
// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default new User()
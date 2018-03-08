//MODULES
import { observable, action } from 'mobx'
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

  @action
  setData = data => {
    return this.data = observable(data)
  }

  @action
  login = async (msisdn, password) => {
    let { is_ok, data: token } = await axios.post(getIAMEndpoint('/login'), {
      msisdn,
      password
    })
    
    if (is_ok) {
      this.fetchData(token)
      return tokens.authToken = token
    }
    return false
  }

  @action
  logout = () => {
    this.data = null
    tokens.authToken = null
    localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
  }

  @action
  fetchData = async token => {
    let authToken = token || localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)
    
    if (authToken) return

    let {data: { is_ok, data: user } } = await axios.get(getIAMEndpoint('/user'))

    if (is_ok) {
      tokens.authToken = authToken
      return this.setData(user)
    }

    localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
    return false
  }
}
 
// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default new User()
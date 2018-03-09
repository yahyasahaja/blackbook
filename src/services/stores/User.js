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
  @observable profilePictureURL
  @observable isLoading

  @action
  setData = data => {
    return this.data = observable(data)
  }

  @action
  getProfilePictureURL() {
    if (this.isLoggedIn && tokens.authToken) 
      return axios.get(getIAMEndpoint('/profpic'))
        .then(({data: { is_ok, uri }}) => {
          if (is_ok) {
            this.profilePictureURL = observable(uri)
            return uri
          }

          return false
        })
        .catch(err => {
          console.log('ERROR ON FETCH PROFILE PICTURE', err)
          return false
        })

    return new Promise(resolve => resolve(false))
  }

  @action
  login = (msisdn, password) => {
    this.isLoading = true
    password = btoa(password)

    return axios.post(getIAMEndpoint('/login'), {
      msisdn,
      password
    }).then(({data: { is_ok, data: token }}) => {
      
      this.isLoading = false
  
      if (is_ok) {
        tokens.setAuthToken(token)
        this.fetchData(token)
        return token
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
  register = (name, msisdn, password, address, country) => {
    this.isLoading = true
    password = btoa(password)
    
    return axios.post(getIAMEndpoint('/login'), {
      msisdn,
      password,
      name,
      address,
      country,
    }).then(({data: { is_ok, data: token }}) => {
      
      this.isLoading = false
  
      if (is_ok) {
        tokens.setAuthToken(token)
        this.fetchData(token)
        return token
      }

      return false
    })
  }

  @action
  fetchData = token => {
    let raw = token || localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)
    
    if (!raw) return new Promise((resolve) => resolve(false))

    let authToken = `Bearer ${raw}`

    this.isLoading = true
    return axios.get(getIAMEndpoint('/user'), {
      headers: {
        Authorization: authToken
      }
    })
      .then(({data: { is_ok, data: user } }) => {
        this.isLoading = false
        if (is_ok) {
          tokens.setAuthToken(raw)
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
export default window.user = new User()
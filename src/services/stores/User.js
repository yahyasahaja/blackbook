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

//UTILS
import {
  getSubscription,
} from '../../utils'

//STORE
class User {
  constructor() {
    //INIT_USER_DATA
    this.fetchData()
  }

  @observable data = null
  @observable profilePictureURL
  @observable isLoading
  @observable isLoadingUpdateProfile
  @observable isLoadingUpdatePassword
  @observable isLoadingLogin

  @action
  setData = data => {
    return this.data = observable(data)
  }

  @action
  getProfilePictureURL() {
    if (this.isLoggedIn && tokens.authToken)
      return axios.get(getIAMEndpoint('/profpic'))
        .then(({ data: { is_ok, uri } }) => {
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
    this.isLoadingLogin = true
    password = btoa(password)

    return axios.post(getIAMEndpoint('/login'), {
      msisdn,
      password
    }).then(({ data: { is_ok, data: token } }) => {

      this.isLoadingLogin = false
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
    tokens.removeAuthToken()
  }

  @action
  updatePassword = ({oldPassword, newPassword}) => {
    this.isLoadingUpdatePassword = true

    return axios.post(getIAMEndpoint('/user/pwd', {
      oldPassword,
      newPassword
    })).then(({data: { is_ok }}) => {
      this.isLoadingUpdatePassword = false
      return is_ok
    })
  }

  @action
  updateProfile = ({ 
    name, 
    msisdn, 
    password, 
    address, 
    country, 
    zip_code, 
    subscription,
    city
  }) => {
    let data = {}
    this.isLoadingUpdateProfile = true

    if (name) data.name = name
    if (msisdn) data.msisdn = msisdn
    if (password) data.password = password
    if (address) data.password = address
    if (country) data.country = country
    if (zip_code) data.zip_code = zip_code
    if (subscription) data.push_id = JSON.stringify(subscription)
    if (city) data.city = city

    return axios.post(getIAMEndpoint('/register'), data)
      .then(({ data: { is_ok, data: token } }) => {
        this.isLoadingUpdateProfile = false

        if (is_ok) {
          return token
        }

        return false
      })
  }

  @action
  register = ({ name, msisdn, password, address, country, zip_code, city }) => {
    password = btoa(password)

    return getSubscription().then(subscription => {
      return this.updateProfile({
        name, 
        msisdn, 
        password, 
        address, 
        country, 
        zip_code, 
        subscription,
        city
      }).then(token => {
        tokens.setAuthToken(token)
        return this.fetchData(token)
      })
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
      .then(({ data: { is_ok, data: user } }) => {
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
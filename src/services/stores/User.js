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
  async uploadProfilePicture(file) {
    let fileType

    if (file.type.indexOf('jpg') !== -1) fileType = 'jpg'
    else if (file.type.indexOf('jpeg') !== -1) fileType = 'jpeg'
    else if (file.type.indexOf('png') !== -1) fileType = 'png'

    if (!fileType) return false

    let formData = new FormData()
    formData.append('file', file)

    let { is_ok, uri } = await axios.post(getIAMEndpoint(`/iam/profpic/${fileType}`), formData)

    if (!is_ok) return false

    this.profilePictureURL = uri
    return uri
  }

  @action
  getProfilePictureURL() {
    if (this.isLoggedIn && tokens.authToken)
      return axios.get(getIAMEndpoint('/profpic'))
        .then(({ data: { is_ok, uri } }) => {
          if (is_ok) {
            this.profilePictureURL = uri
            return uri
          }

          return false
        })
        .catch(err => {
          console.log('ERROR ON FETCHING PROFILE PICTURE', err)
          return false
        })

    return new Promise(resolve => resolve(false))
  }

  @action
  login = async (msisdn, password) => {
    this.isLoadingLogin = true
    password = btoa(password)

    try {
      let { data: { is_ok, data: token } } = await axios.post(getIAMEndpoint('/login'), {
        msisdn,
        password
      })

      this.isLoadingLogin = false
      if (is_ok) {
        tokens.setAuthToken(token)
        await this.fetchData(token)
        await this.registerPushSubscription()
        return token
      }

      return false
    } catch (err) {
      console.log('ERROR ON LOGGING IN', err)
      return false
    }
  }

  @action
  logout = () => {
    this.data = null
    tokens.removeAuthToken()
  }

  @action
  updatePassword = ({ oldPassword, newPassword }) => {
    this.isLoadingUpdatePassword = true


    return axios.post(getIAMEndpoint('/user/pwd', {
      oldPassword: btoa(oldPassword),
      newPassword: btoa(newPassword)
    })).then(({ data: { is_ok } }) => {
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
          tokens.setAuthToken(token)
          return this.fetchData(token)
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
      })
    })
  }

  @action
  registerPushSubscription = async pushSubscription => {
    try {
      if (!pushSubscription)
        pushSubscription = await getSubscription()
      
      if (!pushSubscription || !this.isLoggedIn) return false

      let authToken = tokens.token

      pushSubscription = pushSubscription.toJSON()
      pushSubscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
          auth: pushSubscription.kays.auth,
          p256dh: pushSubscription.keys.p256dh
        }
      }

      let { data: { is_ok } } = await axios.post(getIAMEndpoint('/renewpush'),
        pushSubscription,
        {
          headers: {
            Authorization: authToken
          }
        }
      )

      if (is_ok) console.log('PUSH SUBSCRIPTION HAS BEEN REGISTERED')
      return is_ok
    } catch (err) {
      console.log('ERROR ON REGISTERING PUSH SUBSCRIPTION', err)
      return false
    }
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
        console.log('ERROR ON FETCHING USER DATA', res)
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
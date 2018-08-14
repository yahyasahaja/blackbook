//MODULES
import { observable, action, computed } from 'mobx'
import axios from 'axios'
import Raven from 'raven-js'
import ReactGA from 'react-ga'

//CONFIG
import {
  getIAMEndpoint,
  AUTHORIZATION_TOKEN_STORAGE_URI,
} from '../../config'

//TOKENS
import tokens from './Tokens'
import favorites from './Favorites'
import cart from './Cart'

//UTILS
import {
  getSubscription,
  getQueryString,
  setAxiosAuthorization,
} from '../../utils'

const isNotLocal = () => !(location.href.includes('localhost') || /127\.[\d]+\.[\d]+\.[\d]+/gi.test(location.href))
//STORE
class User {
  @observable data = null
  @observable profilePictureURL
  @observable isLoading
  @observable isLoadingUpdateProfile
  @observable isLoadingUpdatePassword
  @observable isLoadingLogin
  @observable isLoadingUploadProfilePic
  @observable isLoadingSendingOTP
  @observable isLoadingChangePassword
  @observable msisdn

  @action
  setMsisdn = msisdn => {
    return this.msisdn = msisdn
  }

  @action
  setData = data => {
    ReactGA.set({userId:data.id})
    return this.data = observable(data)
  }

  @action
  async checkSecretKeyLogin() {
    if (this.isLoadingLogin) return

    let secretstring = getQueryString('key')
    if (!secretstring) return
    
    return await this.loginUsingSecretString(secretstring)
  }

  @action
  async loginUsingSecretString(secretstring) {
    this.isLoadingLogin = true

    try {
      let { data: { is_ok, data: token} } = await axios.post(
        getIAMEndpoint(`/loginkey?key=${secretstring}`), 
        {}
      )
      
      if (!is_ok) return 
      
      this.isLoadingLogin = false
      favorites.clear()
      // cart.clear()
      tokens.setAuthToken(token)
      if(isNotLocal()) Raven.setUserContext({token})
      await this.fetchData(token)
      await this.registerPushSubscription()
      return token
    } catch (e) {
      console.log('ERROR WHILE LOGIN WITH SECRET STRING', e)
      if(isNotLocal()) Raven.captureException(e)
    }
  }

  async uploadProfilePicture(files) {
    let fileType
    let file = files[0]

    if (file.type.indexOf('jpg') !== -1) fileType = 'jpg'
    else if (file.type.indexOf('jpeg') !== -1) fileType = 'jpeg'
    else if (file.type.indexOf('png') !== -1) fileType = 'png'
    
    let reader = new FileReader()
    reader.onloadend = ev => this.processUploadProfilePicFile(ev.target.result, fileType)
    reader.readAsArrayBuffer(file)
  }

  async processUploadProfilePicFile(data, fileType) {
    try {
      console.log(fileType, `Bearer ${tokens.bearerToken}`)
      this.isLoadingUploadProfilePic = true
      let { data: { is_ok, uri } } = await axios.post(
        getIAMEndpoint(`/iam/profpic/${fileType}`),
        {},
        {
          headers: {
            Authorization: tokens.bearerToken
          }
        }
      )
      
      if (!is_ok) return false
      
      delete axios.defaults.headers['Authorization']
      await axios.put(uri, data, {
        headers: {
          'x-ms-blob-type': 'BlockBlob',
        }
      })
      
      setAxiosAuthorization(tokens.bearerToken)
      this.getProfilePictureURL()
    } catch (e) {
      console.log(e)
      if(isNotLocal()) Raven.captureException(e)
    }

    this.isLoadingUploadProfilePic = false
  }

  @action
  getProfilePictureURL() {
    if (this.isLoggedIn && tokens.rawAuthToken)
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
        favorites.clear()
        // cart.clear()
        tokens.setAuthToken(token)
        if(isNotLocal()) Raven.setUserContext({
          msisdn,
          token
        })
        await this.fetchData(token)
        await this.registerPushSubscription()
        return token
      }

      return false
    } catch (err) {
      this.isLoadingLogin = false
      console.log('ERROR ON LOGGING IN', err)
      return false
    }
  }

  @action
  logout = async () => {
    this.data = null
    await tokens.refetchAPIToken()
    tokens.removeAuthToken()
    favorites.clear()
    cart.clear()
    if(isNotLocal()) Raven.setUserContext()
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
  forgotPassword = (confirmPassword, msisdn, validToken) => {
    this.isLoadingChangePassword = true
    console.log(confirmPassword , msisdn, validToken)
    return axios.post(getIAMEndpoint(`/forgot/${msisdn}`), {
      validToken: validToken,
      password: btoa(confirmPassword)
    }).then(({ data }) => {
      this.isLoadingChangePassword = false
      return data
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
    if (address) data.address = address
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
  sendOTP = async msisdn => {
    try {
      this.isLoadingSendingOTP = true
      let res = await axios.post(getIAMEndpoint(`/otp-sms/${msisdn}`))
      this.isLoadingSendingOTP = false

      return res
    } catch (e) {
      console.log(e)
    }
  }

  @action
  confirmOTP = async (msisdn, otp, secret) => {
    try {
      this.isLoadingSendingOTP = true
      let { data } = await axios.post(getIAMEndpoint(`/otp-sms/${msisdn}`), {
        secret, otp
      })
      this.isLoadingSendingOTP = false

      return data
    } catch (e) {
      console.log(e)
    }
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
      
      // console.log('REGISTERING THIS SUBSCRIPTION:', pushSubscription, this.isLoggedIn)
      if (!pushSubscription || !this.isLoggedIn) return false

      let authToken = tokens.bearerToken

      pushSubscription = pushSubscription.toJSON()
      pushSubscription = {
        endpoint: pushSubscription.endpoint,
        keys: {
          auth: pushSubscription.keys.auth,
          p256dh: pushSubscription.keys.p256dh
        }
      }

      console.log('PUSH SUBSCRIPTION TO BE PUSHED TO SERVER', pushSubscription)
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
        if (is_ok) {
          tokens.setAuthToken(raw)
          const res = this.setData(user)
          this.isLoading = false
          return res
        }

        // this.logout()
        this.isLoading = false
        console.log('LOGOUT')
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
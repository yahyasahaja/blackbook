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
  getQueryString,
} from '../../utils'

//STORE
class User {
  constructor() {
    //INIT_USER_DATA
    this.fetchData().then(data => {
      if (data) this.registerPushSubscription()
    }).catch(e => console.log('CANT FETCH USER DATA', e))
  }

  @observable data = null
  @observable profilePictureURL
  @observable isLoading
  @observable isLoadingUpdateProfile
  @observable isLoadingUpdatePassword
  @observable isLoadingLogin
  @observable isLoadingUploadProfilePic
  @observable isLoadingSendingOTP

  @action
  setData = data => {
    return this.data = observable(data)
  }

  @action
  async checkSecretKeyLogin() {
    if (this.isLoadingLogin) return

    let secretstring = getQueryString('key')
    if (!secretstring) return
    
    this.isLoadingLogin = true
    let { data: { is_ok, data: token} } = await axios.post(
      getIAMEndpoint(`/loginkey?key=${secretstring}`), 
      {}
    )
    
    if (!is_ok) return 
    
    this.isLoadingLogin = false
    tokens.setAuthToken(token)
    await this.fetchData(token)
    await this.registerPushSubscription()
    return token
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
      console.log(fileType, `Bearer ${tokens.token}`)
      this.isLoadingUploadProfilePic = true
      let { data: { is_ok, uri } } = await axios.post(
        getIAMEndpoint(`/iam/profpic/${fileType}`),
        {},
        {
          headers: {
            Authorization: tokens.token
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
      
      axios.defaults.headers['Authorization'] = tokens.token
      this.getProfilePictureURL()
    } catch (e) {
      console.log(e)
    }

    this.isLoadingUploadProfilePic = false
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
      this.isLoadingLogin = false
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
      let { data: { is_ok }} = await axios.post(getIAMEndpoint(`/otp-sms/${msisdn}`), {
        secret, otp
      })
      this.isLoadingSendingOTP = false

      return is_ok
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

      let authToken = tokens.token

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

        localStorage.removeItem(AUTHORIZATION_TOKEN_STORAGE_URI)
        this.isLoading = false
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
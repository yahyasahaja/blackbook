const prodSetup = {
  iam : 'https://api.blanja.tw/iam',
  productql : 'https://api.blanja.tw/productql',
  orderql : 'https://api.blanja.tw/orderql',
  chatql : 'https://api.blanja.tw/chatql',
  userql : 'https://api.blanja.tw/userql'
}

const isProd = window.location.host.match(/^(?:www.)?blanja\.(?:tw|hk)/gi)
export const COUNTRY_CODE = isProd ? (window.location.host.substr(-2) === 'tw' ? 'TWN' : 'HKG') : 'TWN'

export const PRODUCTS_ENDPOINT_URL = isProd ? prodSetup.productql : 'https://product-hub-testing.azurewebsites.net/graphql'
export const ORDERING_ENDPOINT_URL = isProd ? prodSetup.orderql : 'https://ordering-service-testing.azurewebsites.net/graphql'
export const IAM_ENDPOINT_URL = isProd ? prodSetup.iam : 'https://iam-message-testing.azurewebsites.net'
export const CHAT_ENDPOINT_URL = isProd ? prodSetup.chatql : 'https://iam-message-testing.azurewebsites.net/chatql'
export const USER_ENDPOINT_URL = isProd ? prodSetup.userql :' https://iam-message-testing.azurewebsites.net/userql'

export const getIAMEndpoint = params => `${IAM_ENDPOINT_URL}${params || ''}`

export const API_TOKEN_STORAGE_URI = 'hashAPIToken'
export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'
export const FAVORITES_STORAGE_URI = 'favorites'

export const CART_STORAGE_URI = 'cart'

export default {
  PRODUCTS_ENDPOINT_URL,
  ORDERING_ENDPOINT_URL,
  IAM_ENDPOINT_URL,
  CHAT_ENDPOINT_URL,
  USER_ENDPOINT_URL,

  getIAMEndpoint,

  API_TOKEN_STORAGE_URI,
  AUTHORIZATION_TOKEN_STORAGE_URI,
  FAVORITES_STORAGE_URI,

  CART_STORAGE_URI,

  COUNTRY_CODE,
}
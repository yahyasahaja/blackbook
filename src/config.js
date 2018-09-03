const prodSetup = {
  iam : 'https://api.jualbli.com/iam',
  productql : 'https://api.jualbli.com/productql',
  orderql : 'https://api.jualbli.com/orderql',
  chatql : 'https://api.jualbli.com/iam/chatql',
  userql : 'https://api.jualbli.com/iam/userql'
}

export const IS_PROD = window.location.host.match(/^(?:www.)?jualbli\.com/gi)
export const COUNTRY_CODE = IS_PROD ? (window.location.host.substr(-2) === 'tw' ? 'TWN' : 'HKG') : 'TWN'

export const PRODUCTS_ENDPOINT_URL = IS_PROD ? prodSetup.productql : 'https://product-hub-testing.azurewebsites.net/graphql'
export const ORDERING_ENDPOINT_URL = IS_PROD ? prodSetup.orderql : 'https://ordering-service-testing.azurewebsites.net/graphql'
export const IAM_ENDPOINT_URL = IS_PROD ? prodSetup.iam : 'https://iam-message-testing.azurewebsites.net'
export const CHAT_ENDPOINT_URL = IS_PROD ? prodSetup.chatql : 'https://iam-message-testing.azurewebsites.net/chatql'
export const USER_ENDPOINT_URL = IS_PROD ? prodSetup.userql :' https://iam-message-testing.azurewebsites.net/userql'

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
  IS_PROD,
}
let PRODUCTS_ENDPOINT_URL = 'https://product-hub-testing.azurewebsites.net/graphql'
let ORDERING_ENDPOINT_URL = 'https://ordering-service-testing.azurewebsites.net/graphql'
let IAM_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net'
let CHAT_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net/chatql'
let USER_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net/userql'

let getIAMEndpoint = params => `${IAM_ENDPOINT_URL}${params || ''}`

let API_TOKEN_STORAGE_URI = 'hashAPIToken'
let AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

let CART_STORAGE_URI = 'cart'

if (process.env.NODE_ENV === 'production') {
  PRODUCTS_ENDPOINT_URL = 'https://api.blanja.tw/productql'
  ORDERING_ENDPOINT_URL = 'https://api.blanja.tw/orderql'
  IAM_ENDPOINT_URL = 'https://api.blanja.tw/iam'
  CHAT_ENDPOINT_URL = 'https://api.blanja.tw/chatql'
  USER_ENDPOINT_URL = 'https://api.blanja.tw/userql'
}

export {
  PRODUCTS_ENDPOINT_URL,
  ORDERING_ENDPOINT_URL,
  IAM_ENDPOINT_URL,
  CHAT_ENDPOINT_URL,
  USER_ENDPOINT_URL,

  getIAMEndpoint,

  API_TOKEN_STORAGE_URI,
  AUTHORIZATION_TOKEN_STORAGE_URI,

  CART_STORAGE_URI,
}



export default {
  PRODUCTS_ENDPOINT_URL,
  ORDERING_ENDPOINT_URL,
  IAM_ENDPOINT_URL,
  CHAT_ENDPOINT_URL,
  USER_ENDPOINT_URL,

  getIAMEndpoint,

  API_TOKEN_STORAGE_URI,
  AUTHORIZATION_TOKEN_STORAGE_URI,

  CART_STORAGE_URI,
}
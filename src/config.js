export const PRODUCTS_ENDPOINT_URL = 'http://product-hub-testing.azurewebsites.net/graphql'
export const IAM_ENDPOINT_URL = 'http://iam-message-testing.azurewebsites.net'

export const getProductsEndpoint = params => `${PRODUCTS_ENDPOINT_URL}${params}`
export const getIAMEndpoint = params => `${IAM_ENDPOINT_URL}${params}`

export const API_TOKEN_STORAGE_URI = 'hashAPIToken'
export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

export default {
  PRODUCTS_ENDPOINT_URL,
  IAM_ENDPOINT_URL,

  getProductsEndpoint,
  getIAMEndpoint,

  API_TOKEN_STORAGE_URI,
  AUTHORIZATION_TOKEN_STORAGE_URI,
}
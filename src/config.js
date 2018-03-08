export const PRODUCTS_ENDPOINT_URL = 'https://product-hub-testing.azurewebsites.net/graphql'
export const IAM_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net'
export const CHAT_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net/chatql'
export const USER_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net/userql'

export const getIAMEndpoint = params => `${IAM_ENDPOINT_URL}${params || ''}`

export const API_TOKEN_STORAGE_URI = 'hashAPIToken'
export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

export default {
  PRODUCTS_ENDPOINT_URL,
  IAM_ENDPOINT_URL,
  CHAT_ENDPOINT_URL,
  USER_ENDPOINT_URL,

  getIAMEndpoint,

  API_TOKEN_STORAGE_URI,
  AUTHORIZATION_TOKEN_STORAGE_URI,
}
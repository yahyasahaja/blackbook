const test = false
export const DOMAIN_URL = test ? 'http://localhost:5000' : 'https://api.blackbook.ngopi.men'
export const ENDPOINT_URL = `${DOMAIN_URL}/graphql`
export const AUTHORIZATION_TOKEN_STORAGE_URI = 'blackbook983uyAuthURI'

export default {
  ENDPOINT_URL,
}

import { ApolloClient } from 'apollo-client'
// import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import onError from './errorHandler'
import { createUploadLink } from 'apollo-upload-client'

//CONFIG
import {
  ENDPOINT_URL,
} from '../../config'

//STORE
import { token } from '../stores'

// const httpLink = new HttpLink({ 
//   uri: ENDPOINT_URL,
// })

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  if (token.rawAuthToken) {
    if (headers) headers.Authorization = token.bearerToken
    else headers = { Authorization: token.bearerToken }
  }
  // console.log('HEADERS', headers)
  return {
    headers
  }
})

const uploadLink = createUploadLink({
  uri: ENDPOINT_URL,
})

export default new ApolloClient({
  link: authLink.concat(onError).concat(uploadLink),
  cache: new InMemoryCache()
})
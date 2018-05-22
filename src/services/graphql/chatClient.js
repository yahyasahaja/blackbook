
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

//CONFIG
import {
  CHAT_ENDPOINT_URL,
} from '../../config'

//STORE
import { tokens } from '../stores'

let httpLink = new HttpLink({ 
  uri: CHAT_ENDPOINT_URL
})
console.log('production', CHAT_ENDPOINT_URL)

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = tokens.token
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token
    }
  }
})

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})
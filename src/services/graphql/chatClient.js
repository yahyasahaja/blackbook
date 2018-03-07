import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

//CONFIG
import {
  CHAT_ENDPOINT_URL,
  AUTHORIZATION_TOKEN
} from '../../config'

export default new ApolloClient({
  link: new HttpLink({ 
    uri: CHAT_ENDPOINT_URL,
    headers: {
      'Authorization': AUTHORIZATION_TOKEN
    }
  }),
  cache: new InMemoryCache()
})

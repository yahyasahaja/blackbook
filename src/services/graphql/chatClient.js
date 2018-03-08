
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

const authLink = setContext((_, { headers }) => {
  // FOR DEVELOPMENT PURPOSE ONLY
  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTAzYTViMDQtMzQ1Yi00MDE1LTkxMTQtODc0YmM2ZTNmZTY5IiwibXNpc2RuIjoiNjI4MzMzMzMzMzMzMyIsImlhdCI6MTUxODA0NzA3OCwiZXhwIjoxNTI4NDE1MDc4fQ.gb9xF-kmJGZTWUMdkUD2cOMzWCUOxHnI5lZuHLNqzoE' || tokens.token
  
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
})

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})
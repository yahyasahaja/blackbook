import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

//CONFIG
import { CHAT_ENDPOINT_URL } from '../../config'
import { tokens } from '../stores'

// //STORE
// import { tokens } from '../stores'

// let httpLink = new HttpLink({
//   uri: CHAT_ENDPOINT_URL
// })

// const authLink = setContext((_, { headers }) => {
//   // FOR DEVELOPMENT PURPOSE ONLY
//   const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTAzYTViMDQtMzQ1Yi00MDE1LTkxMTQtODc0YmM2ZTNmZTY5IiwibXNpc2RuIjoiNjI4MzMzMzMzMzMzMyIsImlhdCI6MTUxODA0NzA3OCwiZXhwIjoxNTI4NDE1MDc4fQ.gb9xF-kmJGZTWUMdkUD2cOMzWCUOxHnI5lZuHLNqzoE'

//   return {
//     headers: {
//       ...headers,
//       Authorization: token ? `Bearer ${token}` : '',
//     }
//   }
// })

// export default new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache()
// })

const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTAzYTViMDQtMzQ1Yi00MDE1LTkxMTQtODc0YmM2ZTNmZTY5IiwibXNpc2RuIjoiNjI4MzMzMzMzMzMzMyIsImlhdCI6MTUyMDQzNDg0NSwiZXhwIjoxNTMwODAyODQ1fQ.A0SQsCl62u5pATK8sahn8qXa1gv9NAbAkpw3dOvojPw'

export default new ApolloClient({
  link: new HttpLink({
    uri: CHAT_ENDPOINT_URL,
    headers: {
      Authorization: token,
    },
  }),
  cache: new InMemoryCache(),
})

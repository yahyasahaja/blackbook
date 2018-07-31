import {onError} from 'apollo-link-error'
import Raven from 'raven-js'
import { user } from '../stores'

export default onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(errorData => {
      let { message, locations, path } = errorData
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      Raven.captureMessage(`GRAPHQL Request Error : ${message} | User : ${window.user.data?window.user.data.name:'Not Login User'} | Client : ${navigator.userAgent}`)
      console.log(locations)
      return errorData
    })
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)

    if (networkError.statusCode === 401) {
      (async () => {
        await user.logout() 
        location.reload()
      })()
    }
  }
})
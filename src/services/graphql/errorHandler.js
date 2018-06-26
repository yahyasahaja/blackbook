import {onError} from 'apollo-link-error'
import Raven from 'raven-js'
import { user } from '../stores'

export default onError( async ({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
<<<<<<< HEAD

      if(!(
        location.href.includes('localhost') ||
        /127\.[\d]+\.[\d]+\.[\d]+/gi.test(location.href)
      )) 
        Raven.captureMessage('GRAPHQL Request Error :'+message+'| Client : '+navigator.userAgent)
=======
      Raven.captureMessage(`GRAPHQL Request Error : ${message} | User : ${window.user.data?window.user.data.name:'Not Login User'} | Client : ${navigator.userAgent}`)
>>>>>>> 893c715b41324848f97e550f3c09ab3bb1998e06
      console.log(locations)
    })
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)

    if (networkError.statusCode === 401) {
      await user.logout()
      location.reload()
    }
  }
})
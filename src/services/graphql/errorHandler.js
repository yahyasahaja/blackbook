import {onError} from 'apollo-link-error'
import Raven from 'raven-js'

export default onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      if(!(
        location.href.includes('localhost') ||
        /127\.[\d]+\.[\d]+\.[\d]+/gi.test(location.href)
      )) 
        Raven.captureMessage('GRAPHQL Request Error :'+message+'| Client : '+navigator.userAgent)
      console.log(locations)
    })
  if (networkError) console.log(`[Network error]: ${networkError}`)
})
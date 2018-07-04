//MODULES
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-css-themr'
import { ApolloProvider } from 'react-apollo'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { observer } from 'mobx-react'
import axios from 'axios'
console.log('check for update 2')
//CSS
import theme from './assets/theme/theme.js'
import ProgressbarTheme from './assets/css/theme-progress-bar.scss'

//ROUTER
import AppRouter from './AppRouter'

//SERVICES
import client from './services/graphql/productClient'
import { onlineStatus, snackbar, tokens } from './services/stores'

//SERVICE_WORKER
import registerServiceWorker from './registerServiceWorker'

//SENTRY INTEGRATION
import Raven from 'raven-js'

//GOOGLE ANALYTICS
import ga from './google-analytics'

//sw
registerServiceWorker()

//google-analytics
ga()

const contextTheme = theme

if (
  !(
    location.href.includes('localhost') ||
    /127\.[\d]+\.[\d]+\.[\d]+/gi.test(location.href)
  )
)
  Raven.config(
    'https://c63c8415e02b4f8f8052e6e8b7f2bada@sentry.io/1212575'
  ).install()

axios.defaults.headers['Content-Type'] = 'application/json'
axios.interceptors.response.use(
  res => res,
  err => {
    Raven.captureException(err)
    return Promise.reject(err)
  }
)
// if (tokens.token) axios.defaults.headers['Authorization'] = tokens.token

@observer
class App extends Component {
  componentDidCatch(err) {
    Raven.captureException(err)
  }

  render() {
    // console.log(tokens.rawToken)
    if (!tokens.rawToken)
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'
          }}
        >
          <ProgressBar
            theme={ProgressbarTheme}
            type="circular"
            mode="indeterminate"
          />
        </div>
      )

    return (
      <ApolloProvider client={client}>
        <ThemeProvider theme={contextTheme}>
          <AppRouter onlineStatus={onlineStatus} snackbar={snackbar} />
        </ThemeProvider>
      </ApolloProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

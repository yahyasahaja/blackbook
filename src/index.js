//MODULES
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-css-themr'
import { ApolloProvider } from 'react-apollo'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { observer } from 'mobx-react'
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'
// OfflinePluginRuntime.install()
import axios from 'axios'

registerServiceWorker()

//CSS
import theme from './assets/theme/theme.js'
import 'react-image-gallery/styles/css/image-gallery.css'

//ROUTER
import AppRouter from './AppRouter'

//SERVICES
import client from './services/graphql/productClient'
import { onlineStatus, snackbar, tokens } from './services/stores'

//SERVICE_WORKER
import registerServiceWorker from './registerServiceWorker'

const contextTheme = theme

axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['Authorization'] = tokens.token

@observer
class App extends Component {
  render() {
    if (!tokens.token)
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
            type="circular"
            mode="indeterminate"
            multicolor="multicolor"
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
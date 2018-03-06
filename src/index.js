//MODULES
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-css-themr'
import { ApolloProvider } from 'react-apollo'
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'
// OfflinePluginRuntime.install()

//CSS
import theme from './assets/css/theme.scss'

//ROUTER
import AppRouter from './AppRouter'

//SERVICES
import client from './services/graphql/client'
import { onlineStatus, snackbar } from './services/stores'

const contextTheme = {
  RTInput: theme
}

class App extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <ApolloProvider client={client} >
        <ThemeProvider theme={contextTheme}>
          <AppRouter onlineStatus={onlineStatus} snackbar={snackbar} />
        </ThemeProvider>
      </ApolloProvider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
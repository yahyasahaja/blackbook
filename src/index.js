//MODULES
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-css-themr'
import { ApolloProvider } from 'react-apollo'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { observer } from 'mobx-react'
// import * as OfflinePluginRuntime from 'offline-plugin/runtime'
// OfflinePluginRuntime.install()

//CSS
import theme from './assets/css/theme.scss'

//ROUTER
import AppRouter from './AppRouter'

//SERVICES
import client from './services/graphql/client'
import { onlineStatus, snackbar, tokens } from './services/stores'

const contextTheme = {
  RTInput: theme
}

@observer
class App extends Component {
  componentDidMount() {

  }

  render() {
    if (!tokens.token) return <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}
    >
      <ProgressBar
        type='circular'
        mode='indeterminate' multicolor
      /></div>

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
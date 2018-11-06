//MODULES
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'react-css-themr'
// import ProgressBar from 'react-toolbox/lib/progress_bar'
import { observer } from 'mobx-react'
import axios from 'axios'
//CSS
import theme from './assets/theme/theme.js'
// import ProgressbarTheme from './assets/css/theme-progress-bar.scss'

//ROUTER
import AppRouter from './AppRouter'

//SERVICES
import { onlineStatus, snackbar } from './services/stores'

//SERVICE_WORKER
import registerServiceWorker from './registerServiceWorker'

//SENTRY INTEGRATION
import Raven from 'raven-js'

//GOOGLE ANALYTICS
import ga from './google-analytics'

window.Clipboard = (function (window, document, navigator) {
  var textArea,
    copy

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i)
  }

  function createTextArea(text) {
    textArea = document.createElement('textArea')
    textArea.value = text
    document.body.appendChild(textArea)
  }

  function selectText() {
    var range,
      selection

    if (isOS()) {
      range = document.createRange()
      range.selectNodeContents(textArea)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textArea.setSelectionRange(0, 999999)
    } else {
      textArea.select()
    }
  }

  function copyToClipboard() {
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  copy = function (text) {
    createTextArea(text)
    selectText()
    copyToClipboard()
  }

  return {
    copy: copy
  }
})(window, document, navigator)

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
// if (tokens.bearerToken) axios.defaults.headers['Authorization'] = tokens.bearerToken

@observer
class App extends Component {
  componentDidCatch(err) {
    Raven.captureException(err)
  }

  render() {
    return (
      <ThemeProvider theme={contextTheme}>
        <AppRouter onlineStatus={onlineStatus} snackbar={snackbar} />
      </ThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

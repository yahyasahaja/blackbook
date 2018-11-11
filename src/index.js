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
axios.defaults.headers['Content-Type'] = 'application/json'
// if (tokens.bearerToken) axios.defaults.headers['Authorization'] = tokens.bearerToken

@observer
class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppRouter onlineStatus={onlineStatus} snackbar={snackbar} />
      </ThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

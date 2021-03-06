//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'

//STYLES
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'
import styles from './css/index-async.scss'

//COMPONENT
import { snackbar, reloadCountdownTimer } from '../../services/stores'

//CONFIG
// import { IS_PROD } from '../../config'

//EXPORT ALL
export class AsyncComponent extends Component {
  state = {
    Component: null,
    loading: true
  }

  componentWillMount() {
    this.setState({ loading: true },
      async () => {
        try {
          let mod = await this.props.load()
          this.setState({ loading: false, Component: mod.default })
        } catch (err) {
          reloadCountdownTimer.reload()
          snackbar.show('There\'s an Error occured')
          console.log('ERROR WHILE LOADING PAGE ROUTE', err)
        }
      }
    )
  }

  render() {
    if (this.state.loading) return (
      <div className={styles.container}>
        <ProgressBar
          className={styles.loading}
          type='circular' theme={ProgressBarTheme}
          mode='indeterminate'
        />
      </div> 
    )

    return this.props.children(this.state.Component)
  }
}

export const asyncComponent = load => props => (
  <AsyncComponent load={load} >
    {Component => !!Component ? <Component {...props} /> : null}
  </AsyncComponent>
)

//DEFAULTS
export default asyncComponent
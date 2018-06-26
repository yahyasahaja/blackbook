//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { Redirect, Route, Switch } from 'react-router-dom'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import { withTracker } from '../../google-analytics'

//STYLES
import styles from './css/index-auth.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import Login from './Login'
import Register from './Register'

//STORE
import { user, appStack } from '../../services/stores'

//COMPONENT
@observer
class Auth extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  renderLogin() {
    return <div />
  }

  renderContent = () => {
    if (user.isLoading) return <div className={styles.loading} >
      <div>
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    </div>

    if (user.isLoggedIn) return <Redirect to="/account" />
    return (
      <Switch>
        <Redirect from="/auth" exact to="/auth/login" />
        <Route path="/auth/login" render={props => {
          return <Login {...props} setTitle={this.setTitle} />
        }} />
        <Route path="/auth/register" render={props => {
          return <Register {...props} setTitle={this.setTitle} />
        }} />
        <Redirect from="*" to="/auth/login" />
      </Switch>
    )
  }

  setTitle = (title) => {
    this.setState({title})
  }

  state = {
    title: 'Auth'
  }

  render() {
    return (
      <PopupBar
        title={this.state.title} {...this.props}
        renderContent={this.renderContent}
        backLink="/account"
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default withTracker(Auth)
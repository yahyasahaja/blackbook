//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { Redirect, Route, Switch } from 'react-router-dom'
// import _ from 'lodash'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/index-auth.scss'

//COMPONENTS
import PopupBar from '../../components/PopupBar'
import Login from './Login'
import Register from './Register'

//STORE
import { user } from '../../services/stores'

//COMPONENT
@observer
class Auth extends Component {
  renderLogin() {
    return <div />
  }

  renderContent = () => {
    if (user.isLoading) return <div className={styles.loading} >
      <div>
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' multicolor
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
      />
    )
  }
}

export default Auth
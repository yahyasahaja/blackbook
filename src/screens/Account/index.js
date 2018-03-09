//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import { Switch, Route } from 'react-router-dom'

//STYLES
import styles from './css/index-account.scss'

//COMPONENTS
import TopBar, { ABSOLUTE } from '../../components/TopBar'
import Authorized from './Authorized'
import Unauthorized from './Unauthorized'
import asyncComponent from '../../components/AsyncComponent'

//ASYNC_SCREEN
const Profile = asyncComponent(() => import('./Profile.js'))
const Password = asyncComponent(() => import ('./Password.js'))

//STORE
import { user } from '../../services/stores'

//COMPONENT
@observer
class Account extends Component {
  renderAccount() {
    if (user.isLoggedIn) return <Authorized {...this.props} />
    return <Unauthorized />
  }

  renderContent() {
    if (user.isLoading) return <div className={styles.loading} >
      <div>
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' multicolor
        />
      </div>
    </div>

    return (
      <React.Fragment>
        {this.renderAccount()}

        <Switch>
          <Route path="/account/profile" component={Profile} />
          <Route path="/account/password" component={Password} />
        </Switch>
      </React.Fragment>
    )
  }

  render() {
    return (
      <TopBar
        fly={{
          title: { cart: true },
          mode: ABSOLUTE
        }}

        wrapperStyle={{
          padding: 0
        }}

        style={{
          background: '#f8f8f8'
        }}
      >
        {this.renderContent()}
      </TopBar>
    )
  }
}

export default Account
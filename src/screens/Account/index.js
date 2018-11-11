//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/index-account.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import TopBar, { ABSOLUTE } from '../../components/TopBar'
import Authorized from './Authorized'
import Unauthorized from './Unauthorized'

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
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    </div>

    return this.renderAccount()
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

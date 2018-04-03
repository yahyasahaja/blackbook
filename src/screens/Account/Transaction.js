//MODULES
import React, { Component } from 'react'
// import _ from 'lodash'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/transaction.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import ScopeBar from '../../components/ScopeBar'
import TransactionList from '../../components/TransactionList'

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

  componentDidMount() {
    user.getProfilePictureURL()
    this.setState({ ...user.data })
  }

  state = {

  }

  onClick = () => {

  }

  scopeBarData = [
    {
      label: 'Proses',
      onClick: this.onClick
    },
    {
      label: 'Selesai',
      onClick: this.onClick
    }
  ]

  renderContent = () => {
    return (
      <div className={styles.container} >
        <div className={styles.scope} >
          <ScopeBar data={this.scopeBarData} />
        </div>
        <div className={styles.list} >
          <TransactionList />
        </div>
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title="Daftar Transaksi" {...this.props}
        renderContent={this.renderContent}
        backLink="/account"
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default Auth
//MODULES
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Threads from './Threads'
import { user } from '../../services/stores'

//STYLES
// import styles from './css/index.scss'

//COMPONENTS
import TopBar, { HIDE } from '../../components/TopBar'

//COMPONENT
@observer
export default class Chat extends Component {
  render() {
    return (
      <TopBar
        fly={{
          title: { cart: true },
          mode: HIDE,
        }}
        
        isSelected={this.props.isSelected}
        style={{ background: 'rgb(239, 239, 239)' }}
        wrapperStyle={{ padding: 0 }}
      >
        {!user.isLoading && <Threads {...this.props} isSelected={this.props.isSelected} />}
      </TopBar>
    )
  }
}

//MODULES
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Threads from './Threads'

//STYLES
// import styles from './css/index.scss'

//COMPONENTS
import TopBar, { HIDE } from '../../components/TopBar'

//COMPONENT
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
        <Threads />
      </TopBar>
    )
  }
}

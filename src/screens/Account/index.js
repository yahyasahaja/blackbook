//MODULES
import React, { Component }  from 'react'

//STYLES
// import styles from './css/index.scss'

//COMPONENTS
import TopBar, { ABSOLUTE } from '../../components/TopBar'

//COMPONENT
export default class Account extends Component {
  render() {
    return (
      <TopBar
        fly={{
          title: {cart: true},
          mode: ABSOLUTE
        }}
      >
        <h1>Account Example</h1>
      </TopBar>
    )
  }
}
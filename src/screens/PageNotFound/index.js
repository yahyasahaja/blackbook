//MODULES
import React, { Component }  from 'react'

//STYLES
// import styles from './css/index.scss'

//COMPONENTS
import TopBar, { ABSOLUTE } from '../../components/TopBar'

//COMPONENT
export default class PageNotFound extends Component {
  render() {
    return (
      <TopBar
        fly={{
          title: {cart: true},
          mode: ABSOLUTE
        }}
      >
        <h2>404 NOT FOUND</h2>
      </TopBar>
    )
  }
}
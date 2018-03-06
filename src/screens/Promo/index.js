//MODULES
import React, { Component }  from 'react'

//STYLES
// import styles from './css/index.scss'

//COMPONENTS
import TopBar, { HIDE } from '../../components/TopBar'
import Button from '../../components/RoundedButton'

//COMPONENT
export default class Promo extends Component {
  render() {
    return (
      <TopBar
        fly={{
          title: {cart: true},
          mode: HIDE
        }}

        isSelected={this.props.isSelected}
      >
        <Button>Open Search</Button>
      </TopBar>
    )
  }
}
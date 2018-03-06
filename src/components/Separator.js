//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/separator.scss'

//COMPONENT
export default class Pills extends Component {
  render() {
    let { children } = this.props
    return (
      <div className={styles.container} >
        <div className={styles.line1} /> 
        <span>{children}</span>
        <div className={styles.line2} /> 
      </div>
    )
  }
}
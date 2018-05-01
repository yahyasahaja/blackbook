//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/separator.scss'

//COMPONENT
export default class Pills extends Component {
  render() {
    let { children, className } = this.props
    return (
      <div className={`${className} ${styles.container}`} >
        <div className={styles.line1} /> 
        <span>{children}</span>
        <div className={styles.line2} /> 
      </div>
    )
  }
}
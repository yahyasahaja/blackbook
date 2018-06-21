//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/pills.scss'

//COMPONENT
export default class Pills extends Component {
  render() {
    let { /*children,*/ label, onClick, to } = this.props
    
    if (to) return (
      <Link onClick={onClick} className={styles.container} to={to} > 
        <span>{label || this.children}</span>
      </Link>
    )

    return (
      <button onClick={onClick} className={styles.container} > 
        <span>{label || this.children}</span>
      </button>
    )
  }
}
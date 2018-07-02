//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/rounded-button.scss'

//COMPONENT
export default class RoundedButton extends Component {
  render() {
    let { to, onClick, className, children } = this.props

    if (to) return (
      <Link to={to} onClick={onClick} className={`${styles.container} ${className || ''}`}>
        {children}
      </Link>
    )

    return (
      <button className={`${styles.container} ${className || ''}`} onClick={onClick} >
        {children}
      </button>
    )
  }
}
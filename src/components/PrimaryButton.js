//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/primary-button.scss'

//COMPONENT
export default class PrimaryButton extends Component {
  render() {
    let { to, onClick, className, children, icon } = this.props

    if (to) return (
      <Link to={to} onClick={onClick} className={`${styles.container} ${className || ''}`}>
        {icon ? <span className={`mdi mdi-${icon} ${styles.icon}`} /> : ''}
        {children}
      </Link>
    )

    return (
      <button className={`${styles.container} ${className || ''}`} onClick={onClick} >
        {icon? <span className={`mdi mdi-${icon} ${styles.icon}`} /> : '' }
        {children}
      </button>
    )
  }
}
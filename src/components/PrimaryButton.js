//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/primary-button.scss'

//COMPONENT
export default class PrimaryButton extends Component {
  render() {
    let { to, onClick, className, children, icon, type, disabled } = this.props

    if (to)
      return (
        <Link
          data-testid="primary-button"
          to={to}
          onClick={onClick}
          className={`${styles.container} ${className || ''}`}
        >
          {icon ? <span className={`mdi mdi-${icon} ${styles.icon}`} /> : ''}
          {children}
        </Link>
      )

    return (
      <button
        data-testid="primary-button"
        type={type}
        className={`${styles.container} ${disabled ? styles.disabled : ''} ${className || ''}`}
        onClick={disabled ? () => {} : onClick}
      >
        {icon ? <span className={`mdi mdi-${icon} ${styles.icon}`} /> : ''}
        {children}
      </button>
    )
  }
}

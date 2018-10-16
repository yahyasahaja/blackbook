//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/flat-button.scss'

//COMPONENT
export default class FlatButton extends Component {
  render() {
    let { to, onClick, className, children, icon, active, onMouseOver } = this.props

    if (to) return (
      <Link 
        to={to} onClick={onClick} 
        className={`${styles.container} ${active ? styles.active : ''} ${className || ''}`}
        onMouseOver={onMouseOver}
      >
        {icon ? <span className={`mdi mdi-${icon} ${styles.icon}`} /> : ''}
        {children}
      </Link>
    )

    return (
      <button 
        className={`${styles.container} ${active ? styles.active : ''} ${className || ''}`}
        onClick={onClick} 
        onMouseDown={onMouseOver}
        data-testid={this.props['data-testid']}
      >
        {icon? <span className={`mdi mdi-${icon} ${styles.icon}`} /> : '' }
        {children}
      </button>
    )
  }
}
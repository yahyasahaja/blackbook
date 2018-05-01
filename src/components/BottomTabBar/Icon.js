//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/icon.scss'

//COMPONENTS
import Badge from '../Badge'

//COMPONENT
export default class Icon extends Component {
  renderIcon() {
    let { active, badge, icon } = this.props

    if (badge) return <Badge
      className={`${active ? styles.active : ''} ${styles.icon}`}
      icon={`mdi mdi-${icon}${!active ? '-outline' : ''}`}
      badge={badge}
    />

    return <span
      className={`
        mdi mdi-${icon}${!active ? '-outline' : ''}
        ${active ? styles.active : ''} 
        ${styles.icon}`}
    />
  }

  render() {
    let { active, url, label } = this.props
    return (
      <Link className={styles.container} to={url} >
        {this.renderIcon()}
        <span className={`${styles.label} ${active ? styles.active : ''}`}>{label}</span>
      </Link>
    )
  }
}
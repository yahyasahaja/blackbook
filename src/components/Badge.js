//MODULES
import React, { Component } from 'react'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/badge.scss'

//STORE
import { badges } from '../services/stores'

//COMPONENT
@observer 
class Badge extends Component {
  render() { 
    let { icon, badge, className } = this.props 
    
    return (
      <div className={styles.container} >
        <span className={`mdi mdi-${icon} ${className}`} />
        {badges.data[badge] ? <div className={styles.badge}>{badges.data[badge]}</div> : ''}
      </div>
    )
  }
}

export default Badge
//MODULES
import React, { Component }  from 'react'


//STYLES
import styles from './css/title-bar.scss'


//COMPONENT
export default class Home extends Component {
  render() {
    return (
      <div className={styles.container} > 
        <div className={styles.title}><img src="/static/img/logo-500.png" alt=""/></div> 
      </div>
    )
  }
} 
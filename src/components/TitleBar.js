//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/title-bar.scss'

//COMPONENT
export default class Home extends Component {
  render() {
    let { icons } = this.props
    return (
      <div className={styles.container} > 
        <div className={styles.title}><img src="/static/img/logo-500.png" alt=""/></div> 
        {
          icons && (
            icons.map((data, i) => (
              <Link
                to={data.to} className={`mdi mdi-${data.icon} ${styles.icon}`}
                onClick={data.onClick} key={i}
              />
            ))
          )
        }
      </div>
    )
  }
} 
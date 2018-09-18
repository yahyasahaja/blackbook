//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'


//STYLES
import styles from './css/title-bar.scss'

//COMPONENT
import Badge from '../components/Badge'

//STORE
import { badges, serviceWorkerUpdate as swu, country } from '../services/stores'


//COMPONENT
export default class Home extends Component {
  render() {
    let {cart} = this.props
    return (
      <div className={styles.container} > 
        <div className={styles.lefticon}> 
          { !localStorage.getItem('jualbli-hash-appinstalled') &&
            <div className={styles.badge} onClick={() => {
              swu.setManualGuide(true, true)
            }}>
              <Badge icon="bookmark" />
            </div>
          }
          
          <div className={styles.badge} onClick={country.openCountryPage} >
            <Badge icon="earth" />
          </div>
        </div>

        <div className={styles.title}><img src="/static/img/logo-500.png" alt=""/></div> 
        {cart && <Link to="/cart" className={styles.icon}><Badge badge={badges.CART} icon="cart" /></Link> }
      </div>
    )
  }
} 
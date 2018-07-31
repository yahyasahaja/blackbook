//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'


//STYLES
import styles from './css/title-bar.scss'

//COMPONENT
import Badge from '../components/Badge'

//STORE
import { user, badges, serviceWorkerUpdate as swu } from '../services/stores'


//COMPONENT
export default class Home extends Component {
  render() {
    let {cart} = this.props
    return (
      <div className={styles.container} >
        { !user.isLoggedIn && window.location.href.includes('account') 
          ? 
          <div className={styles.a2hsIcon} onClick={() => {
            swu.setManualGuide(true, true)
          }}> 
            <Badge icon="book" />
          </div>
          : '' 
        }
        <div className={styles.title}><span>Blanja</span></div> 
        {cart && <Link to="/cart" className={styles.icon}><Badge badge={badges.CART} icon="cart" /></Link> }
      </div>
    )
  }
} 
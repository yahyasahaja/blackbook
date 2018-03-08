//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/title-bar.scss'

//COMPONENT
import Badge from '../components/Badge'

//STORE
import { badges } from '../services/stores'

//COMPONENT
export default class Home extends Component {
  render() {
    let {cart} = this.props
    return (
      <div className={styles.container} >
        <div className={styles.title}><span>Blanja</span></div> 
        {cart && <Link to="/cart" className={styles.icon}><Badge badge={badges.CART} icon="cart" /></Link> }
      </div>
    )
  }
} 
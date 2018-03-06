//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/search-bar.scss'

//COMPONENTS
import Badge from '../components/Badge'

//STORE
import { badges } from '../services/stores'

//COMPONENT
export default class Home extends Component {
  render() {
    let {cart} = this.props
    return (
      <div className={styles.container} >
        <Link className={styles.search} to="/search">
          <span className={`mdi mdi-magnify ${styles.icon}`} />
          <span className={styles.placeholder}>Mau belanja apa hari ini?</span>
        </Link>
        {cart && <Link to="/cart" className={styles.icon}><Badge badge={badges.CART} icon="cart" /></Link> }
      </div>
    )
  } 
} 
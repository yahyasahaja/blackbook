//MODULES
import React, { Component }  from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/search-bar.scss'

//COMPONENT
export default class SearchBar extends Component {
  render() {
    return (
      <div className={styles.container} >
        <Link className={styles.search} to="/search">
          <span className={`mdi mdi-magnify ${styles.icon}`} />
          <span className={styles.placeholder}>Search hero</span>
        </Link>
      </div>
    )
  } 
} 
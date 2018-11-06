//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './css/card.scss'

//COMPONENT
export default class Card extends Component {
  render() {
    return (
      <Link className={styles.container} to={`/hero/${this.props.id}`} >
        <img src={'http://api.blackbook.ngopi.men' + this.props.image_url} alt="image"/>
      </Link>
    )
  }
}

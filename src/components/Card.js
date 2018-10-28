//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import styles from './css/card.scss'

//COMPONENT
export default class Card extends Component {
  render() {
    return (
      <Link className={styles.container} to={this.props.url} >
        <img src={this.props.img} alt="image"/>
      </Link>
    )
  }
}

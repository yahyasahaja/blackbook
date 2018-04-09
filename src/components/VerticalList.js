//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/vertical-list.scss'

//COMPONENT
export default class VerticalList extends Component {
  render() {
    return (
      <div className={styles.container} >
        <div className={styles.key} >
          {this.props.dataKey}
        </div>

        <div className={styles.value} >
          {this.props.value}
        </div>
      </div>
    )
  }
}

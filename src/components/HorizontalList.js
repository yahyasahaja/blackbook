//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/horizontal-list.scss'

//COMPONENT
export default class VerticalList extends Component {
  render() {
    return (
      <div className={styles.container} >
        <div className={`${styles.key} ${this.props.keyClassName}`} >
          {this.props.dataKey}
        </div>

        <div className={`${styles.value} ${this.props.valueClassName}`} >
          {this.props.value}
        </div>
      </div>
    )
  }
}

/**
 * ScopeBar
 * By Yahya Sahaja
 * USAGE:
 * props.data = [
 *  {
 *    label: !String,
 *    onClick: !Function
 *    to: !String,
 *    default: Boolean
 *  }
 * ]
 */

//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/scope-bar.scss'

//COMPONENT
export default class ScopeBar extends Component {
  componentDidMount() {
    let { data } = this.props

    for (let i in data) if (data[i].default) return this.onClick(i, data[i])

    this.onClick(data[0], 0)
  }

  state = {
    selected: 0,
  }

  onClick(data, index) {
    this.setState({selected: index}, () => {
      if (data.onClick) data.onClick()
    })
  }

  render() {
    let { data } = this.props

    return (
      <div className={styles.container} >
        {data.map((data, i) => {
          let { label, to } = data
          let isSelected = i == this.state.selected
          
          if (to) return (
            <Link 
              className={`${styles.tab} ${isSelected ? styles.selected : ''}`} key={i} 
              onClick={this.onClick.bind(this, data, i)}
              to={to}
            > 
              <span>{label}</span>
            </Link>
          )

          return (
            <button 
              className={`${styles.tab} ${isSelected ? styles.selected : ''}`} key={i} 
              onClick={this.onClick.bind(this, data, i)}
            > 
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    )
  }
}
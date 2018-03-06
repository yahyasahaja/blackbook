/*
CRAETED BY YAHYA SAHAJA
TODO:
- iOS-like tab bar
- update route onclick

USAGE
data = [
  { label: String, icon: String, url: String },
]


*/

//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/tab-bar.scss'

//COMPONENTS
import Icon from './Icon'

//COMPONENT
export default class BottomTabBar extends Component {
  renderIcons() {
    let { icons, match } = this.props
    if (!icons) return

    let currentPath = match.url
    
    return icons.map((data, i) => { 
      let isSame = currentPath.indexOf(data.url) != -1
      return <Icon {...data} active={isSame} key={i} />
    })
  }  

  render() {
    return (
      <div className={styles.container}>
        {this.renderIcons()}
      </div>
    )
  }
}
//COMPONENT
import React from 'react'
// import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/info.scss'

//STORE
import { info } from '../services/stores'

//COMPONENT
@observer
export default class Info extends React.Component {
  getClassState = () => {
    let className = ''

    if (info.isGone) className = styles.isGone + ' '
    else if (info.isActive) className = styles.isActive + ' '
    else className = styles.isInactive + ' '

    return className
  }

  hide = () => {
    info.hide()
  }

  render() {
    info.isActive
    info.forcedToClose
    
    return (
      <div onClick={this.hide} className={`${styles.container} ${this.getClassState()}`} >
        <span className={styles.text} >{info.text}</span>
      </div>
    )
  }
}
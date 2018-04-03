//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/editable-list.scss'

//COMPONENT
class EditableList extends Component {
  render() { 
    let {
      className,
      style,
      disabled
    } = this.props 
    
    return (
      <div 
        className={`${styles.container} ${disabled ? styles.disabled : ''} ${className}`} 
        style={style || {}} 
      >
        <div className={styles.section} > 
          Section 1
        </div>
        <div className={styles.devider} />
        <div className={styles.section} > 
          Section 2
        </div>
        <div className={styles.devider} />
        <div className={styles.section} > 
          Section 3
        </div>
      </div>
    )
  }
}

export default EditableList
//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/editable-list.scss'

//COMPONENT
class EditableList extends Component {
  render() { 
    let { 
      label, 
      value, 
      type, 
      icon, 
      onChange,
      className,
      style,
      placeholder,
      disabled
    } = this.props 
    
    return (
      <div 
        className={`${styles.container} ${disabled ? styles.disabled : ''} ${className}`} 
        style={style || {}} 
      >
        <div>
          { 
            icon
              ? <span className={`mdi mdi-${icon}`} />
              : ''
          }
          <span>{label}</span>
        </div>
        <input 
          type={type || 'text'} 
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className={styles.input}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    )
  }
}

export default EditableList
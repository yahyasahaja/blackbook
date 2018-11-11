//MODULES
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

//STYLES
import styles from './css/upload-image.scss'

//UTILS
import { readURL, makeImageURL } from '../utils'

//COMPONENT
@observer
export default class UploadImage extends Component {
  id = Date.now()

  @observable file = null
  @observable path = ''

  render() {
    return (
      <div className={styles.container + ' '+ this.props.className} >
        <label htmlFor={this.id}>
          {
            this.path || this.props.defaultImage
              ? (
                <div className={styles.image} >
                  <img src={this.path || makeImageURL(this.props.defaultImage)} alt=""/>
                </div>
              )
              : (
                <div className={styles.noimage} >
                  <div className={`mdi mdi-image ${styles.icon}`} />
                  <div>
                    {this.props.title || 'Select an image'}
                  </div>
                </div>
              )
          }

          <input
            id={this.id} name={this.id} type="file" style={{ display: 'none' }}
            onChange={async e => {
              let path = await readURL(this.file = e.target.files[0] || e.dataTransfer.files[0])
              this.path = path
              if (this.props.onChange) this.props.onChange(this.file)
            }}
            accept=".jpg, .jpeg, .png"
          />
        </label>
      </div>
    )
  }
}

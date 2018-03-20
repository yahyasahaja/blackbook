//MODULES
import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'

//IMAGE_PLACEHOLDER
import ImagePlaceholder from '../assets/img/image-placeholder.jpeg'

//STYLE
import styles from './css/image-loader.scss'

//COMPONENT
export default class ImageLoader extends Component {
  state = {
    isLoaded: false,
    isError: false,
  }

  render() {
    let { isLoaded } = this.state

    return (
      <LazyLoad
        height={200}
        placeholder={
          <img
            {...this.props}
            className={isLoaded ? styles.none : ''}
            src={ImagePlaceholder}
          />
        }
      >
        <img {...this.props} />
      </LazyLoad>
    )
  }
}
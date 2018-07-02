//MODULES
import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'

//IMAGE_PLACEHOLDER
import ImagePlaceholder from '../assets/img/image-placeholder.jpeg'

//STYLE
import styles from './css/image-loader.scss'

class Img extends React.Component {
  state = {
    loading: true,
    error: false,
  };

  componentWillMount() {
    // load image and check if it's broken

    const img = new Image()
    img.onload = () => {
      this.setState({
        loading: false,
        error: false,
      })
    }
    img.src = this.props.src
  }

  render() {
    if (this.state.loading || this.state.error) return this.props.placeholder

    let { className, src, alt } = this.props

    return <img className={className} src={src} alt={alt} />
  }
}

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
      >
        <Img placeholder={<img
          {...this.props}
          className={isLoaded ? styles.none : ''}
          src={ImagePlaceholder}
        />} {...this.props} />
      </LazyLoad>
    )
  }
}
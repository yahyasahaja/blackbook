//MODULES
import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'

//IMAGE_PLACEHOLDER
import ImagePlaceholder from '../assets/img/image-placeholder.jpeg'

//COMPONENT
export default class ImageLoader extends Component {
  state = {
    isLoaded: false,
    isError: false,
  }

  render() {
    let { isLoaded } = this.state
    let imageStyle = {}
    let imagePlaceholderStyle = {}

    if (!isLoaded) imageStyle.display = 'none'
    else imagePlaceholderStyle.display = 'none'

    return (
      <React.Fragment>
        <img
          {...this.props}
          style={imagePlaceholderStyle}
          src={ImagePlaceholder}
        />

        <LazyLoad height={200} >
          <img
            {...this.props}
            onLoad={() => this.setState({ isLoaded: true })}
            style={imageStyle}
            onError={() => this.setState({ isError: true })}
          />
        </LazyLoad>
      </React.Fragment>
    )
  }
}
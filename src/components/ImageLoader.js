//MODULES
import React, { Component } from 'react'

//IMAGE_PLACEHOLDER
import ImagePlaceholder from '../assets/img/image-placeholder.jpeg'

//COMPONENT
export default class ImageLoader extends Component {
  state = {
    isLoaded: false
  }
  
  render () {
    let { isLoaded } = this.state
    let imageStyle = {}
    let imagePlaceholderStyle = {}

    if (!isLoaded) imageStyle.display = 'none' 
    if (isLoaded) imagePlaceholderStyle.display = 'none'

    return (
      <React.Fragment>
        <img
          {...this.props}
          style={imagePlaceholderStyle}
          src={ImagePlaceholder}
        />

        <img 
          {...this.props} 
          onLoad={() => this.setState({isLoaded: true})} 
          style={imageStyle}
        />
      </React.Fragment>
    )
  }
}
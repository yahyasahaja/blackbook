import React, { Component } from 'react'
import ReactGA from 'react-ga'

export default () => {
  console.log('initializing google analytics')
  ReactGA.initialize('UA-119141916-1', {
    debug: true,
    titleCase: false,
    gaOptions: {
      userId: window.user.data
        ? window.user.data.id
        : `Not Login (${navigator.userAgent})`
    }
  })
}

export function withTracker(WrappedComponent, options = {}) {
  const trackPage = page => {
    ReactGA.set({
      page,
      ...options
    })
    ReactGA.pageview(page)
  }

  const HOC = class extends Component {
    componentDidMount() {
      const page = this.props.location.pathname
      trackPage(page)
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      if (currentPage !== nextPage) {
        trackPage(nextPage)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return HOC
}

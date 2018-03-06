//MODULES
import React, { Component } from 'react'

//EXPORT ALL
export class AsyncComponent extends Component {
  state = {
    Component: null
  }
 
  componentWillMount() {
    this.props.load().then(mod => this.setState({Component: mod.default}))
  }

  render() {
    return this.props.children(this.state.Component)
  }
}

export const asyncComponent = load => props => (
  <AsyncComponent load={load} >
    {Component => !!Component ? <Component {...props} /> : null}
  </AsyncComponent>
)

//DEFAULTS
export default asyncComponent
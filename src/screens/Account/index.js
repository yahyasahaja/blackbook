//MODULES
import React, { Component } from 'react'
// import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
// import { graphql, compose } from 'react-apollo'
// import gql from 'graphql-tag'
// import { observer } from 'mobx-react'

//STYLES
// import styles from './css/index.scss'

//COMPONENTS
import TopBar, { ABSOLUTE } from '../../components/TopBar'

//COMPONENT
class Account extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <TopBar
        fly={{
          title: { cart: true },
          mode: ABSOLUTE
        }}
      >
        
      </TopBar>
    )
  }
}



export default Account
//MODULES
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/index-bottom-tab-bar.scss'

//COMPONENTS
import TabBar from './TabBar'

//STORE
import { user } from '../../services/stores'

//COMPONENT
@observer
class BottomTabBar extends Component {
  componentDidMount() {
    this.updateRoutes(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateRoutes(nextProps)
  }

  updateRoutes(nextProps) {
    let { match } = nextProps
    let { routers /*raw*/ } = this.state
    let { data } = this.props

    if (!user.isLoggedIn) {
      user.checkSecretKeyLogin()
    }

    let currentPath = match.url

    for (let i in routers) {
      if (currentPath.indexOf(routers[i].url) === 0) {
        this.setState({ currentPage: i })
        return
      }
    }
    //console.log(nextProps, this.props)
    for (let i in data) {
      if (currentPath.indexOf(data[i].url) === 0) {
        this.setState(() => {
          let loc = [...routers]
          loc.push(data[i])

          return {
            routers: loc,
            currentPage: routers.length
          }
        })
        return
      }
    }
  }

  state = {
    routers: [],
    currentPage: 0
  }

  renderData() {
    let { routers, currentPage } = this.state

    return routers.map((data, i) => (
      <div
        key={i}
        style={{
          display: currentPage == i ? 'block' : 'none'
        }}
        className={styles.container}
      >
        <data.Component {...this.props} isSelected={currentPage == i} />
      </div>
    ))
  }

  render() {
    let {
      data,
      appStack: { isPopupActive }
    } = this.props

    return (
      <div
        className={styles.container}
        style={{
          overflow: isPopupActive ? 'hidden' : 'unset'
        }}
      >
        <div className={styles.content}>{this.renderData()}</div>

        <Route path="*" render={props => <TabBar {...props} icons={data} />} />
      </div>
    )
  }
}

export default BottomTabBar

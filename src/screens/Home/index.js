//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/index.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import TopBar, { APPEAR } from '../../components/TopBar'
import Card from '../../components/Card'
// import client from '../../services/graphql/productClient'

//COMPONENT
@observer
class Home extends Component {
  renderCards() {
    let dummy = [
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
      {
        img: '/static/img/sample.png',
        url: '/hero/1'
      },
    ]
    return dummy.map((dt, i) => <Card key={i} {...dt} />)
  }

  render() {
    let loading = false

    return (
      <TopBar
        relative={{
          title: { cart: true },
          search: { cart: false }
        }}
        fly={{
          search: { cart: true },
          mode: APPEAR
        }}
        isSelected={this.props.isSelected}
        style={{ background: 'rgb(76, 76, 76)' }}
        wrapperStyle={{ padding: 0 }}
      >
        <div className={styles.container} >
          {this.renderCards()}
          {loading ? (
            <ProgressBar
              className={styles.loading}
              type="circular"
              theme={ProgressBarTheme}
              mode="indeterminate"
            />
          ) : (
            ''
          )}
        </div>
      </TopBar>
    )
  }
}

export default Home
//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
// import gql from 'graphql-tag' 

//STYLES
import styles from './css/index.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import TopBar, { ABSOLUTE } from '../../components/TopBar'
import Card from '../../components/Card'
// import client from '../../services/graphql/productClient'

//STORE
import { hero, user } from '../../services/stores'

//COMPONENT
@observer
class Home extends Component {
  componentDidMount() {
    hero.fetchAllHeroes()
  }

  renderCards() {
    return hero.allHeroes.map((dt, i) => <Card key={i} {...dt } />)
  }

  render() {
    let loading = false
    let icons = []

    if (user.isLoggedIn && user.data && user.data.role === 'ADMIN') {
      icons = [
        {
          icon: 'plus',
          onClick: e => {
            e.preventDefault()
            this.props.history.push('/hero/new')
          },
          to: ''
        }
      ]
    }

    return (
      <TopBar
        fly={{
          title: { icons },
          mode: ABSOLUTE
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
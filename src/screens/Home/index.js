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
import { hero } from '../../services/stores'

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

    return (
      <TopBar
        fly={{
          title: { cart: true },
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
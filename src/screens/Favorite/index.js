//MODULES
import React, { Component }  from 'react'
import { observer } from 'mobx-react'
import { withTracker } from '../../google-analytics'

//STYLES
import styles from './css/index.scss'

//COMPONENTS
import TopBar, { HIDE } from '../../components/TopBar'
import Card from '../../components/ProductCard'

//REDUX
import { favorites } from '../../services/stores'

//COMPONENT
@observer
class Favorite extends Component {
  renderCards() {
    let fav = favorites.data

    if (fav.length === 0) return (
      <div className={styles.empty} >
        <span className={`mdi mdi-heart ${styles.icon}`} />
        <span className={styles.text} >
          Anda belum memiliki barang favorite
        </span>
      </div>
    )

    return fav.map((data, i) => {
      return <Card {...data} data={data} key={i} />
    })
  }

  render() {
    return (
      <TopBar
        fly={{
          title: {cart: true},
          mode: HIDE
        }}

        isSelected={this.props.isSelected}
        style={{background: 'rgb(239, 239, 239)'}}
      >
        {this.renderCards()}
      </TopBar>
    )
  }
}

export default withTracker(Favorite)

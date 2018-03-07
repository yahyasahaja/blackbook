//MODULES
import React, { Component } from 'react'
import { observer } from 'mobx-react'
// import { Link } from 'react-router-dom'

//STYLES
import styles from './css/product-card.scss'

//COMPONENTS
import FlatButton from './FlatButton'
import PrimaryButton from './PrimaryButton'

//STORE
import { favorites } from '../services/stores'

//INNER_CONFIG
const convertToMoneyFormat = (num, currency) => {
  let res = num.toString().split('').reverse().reduce(function (acc, num, i) {
    return num == '-' ? acc : num + (i && !(i % 3) ? '.' : '') + acc
  }, '')

  return `${currency} ${res}`
}

//COMPONENT
@observer
class ProductCard extends Component {
  onLike = () => { 
    let { data, id } = this.props
    if (!this.liked) favorites.add(data)
    else favorites.remove(id)
  }

  liked = false

  render() {
    let { image, name, price, /*link,*/ id } = this.props
    this.liked = false
    let fav = favorites.data.slice()
    for (let i in fav) if (fav[i].id === id) {
      this.liked = true
      break
    }

    if (!price) price = {
      value: 0,
      currency: 0,
    }

    return (
      <div className={styles.container} >
        <div className={styles.picture} >
          <img src={image} alt='Product Image' />
        </div>
        
        <div className={styles.wrapper} >
          <div className={styles.content} >
            <span className={styles.name} >{name}</span>
            <span className={styles.price}>{convertToMoneyFormat(price.value, price.currency)}</span>
          </div>

          <div className={styles.actions} >
            <div className={styles.left} >
              <FlatButton
                active={this.liked}
                icon={this.liked ? 'heart' : 'heart-outline'}
                onClick={this.onLike}
              >Suka</FlatButton>
              <FlatButton icon='forum' >Chat</FlatButton>
              <FlatButton icon='share' >Bagikan</FlatButton>
            </div>

            <div className={styles.right} >
              <PrimaryButton>BELI</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductCard
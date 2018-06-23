//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import ReactGA from 'react-ga'

//STYLES
import styles from './css/promo-card.scss'

//COMPONENTS
import ImageLoader from './ImageLoader'

//COMPONENT
class ProductCard extends Component {
  state = {
    isVariantOpen: false,
    amount: 1
  }
  componentDidMount() {
    window.addEventListener('scroll', () => {
      ReactGA.event({
        category: 'Promo',
        action: 'Looking and Scrolling Promo'
      })
      window.removeEventListener('scroll')
    })
  }

  render() {
    let { image, begin, end, title, to } = this.props

    return (
      <Link className={styles.container} data-testid="promo-card" to={to}>
        <div className={styles.picture}>
          <ImageLoader src={image} alt="Product Image" />
        </div>

        <div className={styles.wrapper}>
          <div className={styles.left}>
            <span className={styles.title}>{title}</span>
            <span className={styles.time}>
              {moment(begin).format('DD MMM YY')}
              {' - '}
              {moment(end).format('DD MMM YY')}
            </span>
          </div>

          <span className={`mdi mdi-chevron-right ${styles.icon}`} />
        </div>
      </Link>
    )
  }
}

export default ProductCard

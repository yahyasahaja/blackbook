//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'

//STYLES
import styles from './css/promo-detail.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import ImageLoader from '../../components/ImageLoader'

//STORE
import { appStack } from '../../services/stores'

//COMPONENTs
@observer
class PromoDetail extends Component {
  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  state = {
    isLoadingImageError: false,
  }

  copy = () => {
    this.inputCode.select()
    document.execCommand('Copy')
  }

  renderContent = () => {
    if (this.props.promotionQuery.loading)
      return (
        <div className={styles.container}>
          <ProgressBar
            className={styles.loading}
            type='circular' theme={ProgressBarTheme}
            mode='indeterminate'
          />
        </div>
      )

    let { title, description, code, image, begin, end, terms } = this.props.promotionQuery.promotion
    return (
      <div className={styles.container}>
        <div className={styles['wrapper-up']} >
          <div className={styles.image} >
            <ImageLoader src={image} alt="Promotion Image" />
          </div>
          <div className={styles.title} >
            {title}
          </div>
          <div className={styles.desc}>
            <div dangerouslySetInnerHTML={{__html: description || 'Loading deskripsi promo...'}} />
          </div>
        </div>

        <div className={styles['wrapper-down']}>
          <div className={styles.up} >
            <span className={`mdi mdi-timelapse ${styles.icon}`} />
            <span>Periode Promo</span>
            <span>
              {moment(begin).format('DD MMM YY')}
              {' - '}
              {moment(end).format('DD MMM YY')}
            </span>
          </div>

          <div className={styles.down} >
            <div className={styles.title}>
              <span className={`mdi mdi-ticket ${styles.icon}`} />
              <span>Kode Promo</span>
            </div>

            <div className={styles['form-promo']} >
              <input
                className={styles['code-promo']}
                data-testid="code-promo"
                type="text"
                value={code || 'Loading Code Promo..'}
                ref={el => this.inputCode = el}
                onChange={() => 0}
              />

              <button
                onClick={this.copy}
                className={styles.copy}
                type="submit"
              >
                Salin Kode
              </button>
            </div>
          </div>
        </div>

        <div className={styles['wrapper-down']}>
          <div className={styles.wrapper}>
            <div className={styles.title} >
              Syarat dan Ketentuan
            </div>

            <div dangerouslySetInnerHTML={{__html: terms}} />
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title="Detail Promo" {...this.props}
        renderContent={this.renderContent}
        backLink="/promo"
        anim={ANIMATE_HORIZONTAL}
        cart
      />
    )
  }
}

const promotionQuery = gql`
query promotionQuery ($id: ID!) {
  promotion (promotionId: $id) {
    id,
    title,
    description,
    terms,
    code,
    image,
    begin,
    end,
  }
}
`

export default graphql(
  promotionQuery, {
    name: 'promotionQuery',
    options: props => {
      return {
        variables: { id: props.match.params.promotion_id }
      }
    }
  }
)(PromoDetail)

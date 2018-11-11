//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/popup-bar.scss'

//INNER_CONFIG
export const ANIMATE_HORIZONTAL = 'animateHorizontal'
export const ANIMATE_VERTICAL = 'animateVertical'

//COMPONENTS
import Badge from './Badge'

//STORES
import { badges } from '../services/stores'

//COMPONENT
@observer class Popup extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.checkScroll)
    window.addEventListener('gesturechange', this.checkScroll)
    window.scrollTo(0, 0)

    if (this.props.anim) {
      let { anim } = this.props
      setTimeout(() => this.setState({
        anim: anim === ANIMATE_HORIZONTAL ? styles['animate-horizontal']
          : styles['animate-vertical']
      }), 100)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkScroll)
    window.removeEventListener('gesturechange', this.checkScroll)
  }

  onBack = e => {
    let { goBack } = this.props.history
    let { backLink, history } = this.props
    if (backLink) return
    
    e.preventDefault()
    if (history.length <= 2) return history.push('/home')
    goBack()
  }

  checkScroll = () => {
    let { hide } = this.props
    let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)

    // let anim

    if (hide) {
      this.current = scrollTop
      let { shouldAppear } = this.state

      if (scrollTop < 100 && !shouldAppear) this.setState({ shouldAppear: true })
      else if (this.current - this.before > 3 && shouldAppear) { //scrolling down
        this.setState({ shouldAppear: false })
      } else if (this.current - this.before < -10 && !shouldAppear) {
        this.setState({ shouldAppear: true })
      }

      this.before = this.current
    }
  }

  before = 0
  current = 0

  state = {
    anim: '',
    shouldAppear: true
  }

  renderTopComponent() {
    let {
      cart, component, /*backLink, onBack,*/
      rightComponent, icons, /*anim,*/
      // anotherComponents //array
    } = this.props

    if (component) return component
    return <React.Fragment>
      <div className={styles.title}><span>{this.props.title}</span></div>
      {(() => {
        if (rightComponent) return <rightComponent />
        if (cart || icons) return <div className={styles.right} >
          {(() => {
            if (icons) return icons.map((data, i) => 
              <Link
                to={data.to} className={`mdi mdi-${data.icon} ${styles.cart}`}
                onClick={data.onClick} key={i}
              />
            )
            if (cart) return <Link to="/cart" className={styles.cart}><Badge badge={badges.CART} icon="cart" /></Link>
          })()}
        </div>
      })()}
    </React.Fragment>
  }

  render() {
    let {
      /*cart, component,*/ backLink, onBack,
      /*rightComponent, icons,*/ anim, renderContent,
      onTop, //boolean
      anotherComponents //array
    } = this.props
    let { shouldAppear } = this.state
    let style, contentStyle, animClassName
    if (!anim) style = {
      opacity: 1
    }

    if (onTop === false) style = {
      ...style,
      overflowY: 'hidden',
      maxHeight: '100vh'
    }

    if (this.bar) contentStyle = {
      paddingTop: this.bar.offsetHeight + 10
    }

    if (shouldAppear) animClassName = styles.appear
    else animClassName = styles.hide

    return (
      <div style={style} className={`${styles.container} ${this.state.anim}`} >
        <div
          className={`${styles.bar} ${animClassName}`}
          ref={el => this.bar = el}
        >
          <div className={styles['bar-wrapper']} >
            <Link
              to={backLink || '/home'}
              className={`mdi mdi-arrow-left ${styles.back}`}
              onClick={onBack || this.onBack}
            />
            {this.renderTopComponent()}
          </div>
          {anotherComponents}
        </div>

        {
          renderContent ? renderContent() :
            <div className={styles.content} style={{ ...contentStyle, ...this.props.style }} >
              {this.props.children}
            </div>
        }
      </div>
    )
  }
} 

export default Popup
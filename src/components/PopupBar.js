//MODULES
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

//STYLES
import styles from './css/popup-bar.scss'

//INNER_CONFIG
export const ANIMATE_HORIZONTAL = 'animateHorizontal'
export const ANIMATE_VERTICAL = 'animateVertical'

//COMPONENT
export default class Popup extends Component {
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

  onBack = () => {
    let { length, goBack, push } = this.props.history

    if (length == 1) {
      push('/home')
    } else goBack()
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
    return [
      <div key="title" className={styles.title}><span>{this.props.title}</span></div>,
      (() => {
        if (rightComponent) return <rightComponent />
        if (cart || icons) return <div className={styles.right} >
          {(() => {
            if (cart) return <Link to="/cart" className={`mdi mdi-cart ${styles.cart}`} />
            if (icons) return icons.map(data => {
              <Link
                to={data.to} className={`mdi mdi-${data.icon} ${styles.cart}`}
                onClick={data.onClick}
              />
            })
          })()}
        </div>
      })()
    ]
  }

  render() {
    let {
      /*cart, component,*/ backLink, onBack,
      /*rightComponent, icons,*/ anim, renderContent,
      anotherComponents //array
    } = this.props
    let { shouldAppear } = this.state
    let style, contentStyle, animClassName
    if (!anim) style = {
      opacity: 1
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
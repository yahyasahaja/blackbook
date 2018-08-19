/*
  TOP BAR
  by Yahya Sahaja
  created on February 3, 2018
  for Hash.Jualbli

  USAGE 
  props.relative = {
    title: {
      cart: Boolean, //default true
    }

    search: {
      cart: Boolean, //default true,
    }
  }

  props.fly = {
    title: {
      cart: Boolean, //default true
    }

    search: { //default null
      cart: Boolean, //default true,
    }
    
    mode: ENUM('hide', 'appear', 'absolute') //default 'appear'
  }

*/

//MODULES
import React, { Component } from 'react'
// import axios from 'axios'

//STYLES
import styles from './css/top-bar.scss'

//COMPONENTS
import TitleBar from './TitleBar'
import SearchBar from './SearchBar'

export const HIDE = 'hide'
export const APPEAR = 'appear'
export const ABSOLUTE = 'absolute'

//COMPONENT
export class TopBar extends Component {
  componentWillReceiveProps(nextProps) {
    let isSelectedCurrent = nextProps.isSelected
    let isSelectedBefore = this.props.isSelected

    if (isSelectedCurrent != isSelectedBefore) {
      this.addScrollListener(isSelectedCurrent)
    }
  }

  componentDidMount() {
    this.before = this.current = document.documentElement.scrollTop
    window.scrollTo(0, 0)
    this.addScrollListener(this.props.isSelected)
    this.checkScroll()
  }

  addScrollListener(isSelected) {
    if (isSelected) {
      window.addEventListener('scroll', this.checkScroll)
      window.addEventListener('gesturechange', this.checkScroll)
    } else {
      window.removeEventListener('scroll', this.checkScroll)
      window.removeEventListener('gesturechange', this.checkScroll)
    }
  }

  checkScroll = () => {
    let { fly, /*relative*/ } = this.props
    if (!fly) return
    let { /*search, title,*/ mode } = fly
    let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)

    // let anim

    if (mode === APPEAR && this.relativeContainer) {
      let minimalPosition = this.relativeContainer.offsetHeight
      let { shouldAppear } = this.state

      if (scrollTop < 5) {
        this.setState({
          forceHide: true,
        })
      } else if (scrollTop > minimalPosition && !shouldAppear) {
        this.setState({
          shouldAppear: true,
          forceHide: false,
        })
      } else if (scrollTop < minimalPosition && shouldAppear) {
        this.setState({
          shouldAppear: false,
          forceHide: false,
        })
      }
    } else if (mode === HIDE) {
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

  renderRelativeTopBar() {
    let { relative, component } = this.props
    if (!relative) return
    let { search, title } = relative

    return (
      <div
        className={styles.relative}
        ref={el => this.relativeContainer = el}
      >
        {
          (() => {
            if (component) return component
            else return [
              title && <TitleBar key={0} cart={title.cart} />,
              search && <SearchBar key={1} cart={search.cart} />
            ]
          })()
        }
      </div>
    )
  }

  renderFlyTopBar() {
    let { fly, /*relative,*/ component } = this.props
    if (!fly) return
    let { search, title, mode } = fly
    let { shouldAppear, forceHide } = this.state
    let style
    if (forceHide && mode === APPEAR) style = {
      opacity: forceHide ? 0 : 1,
      transition: '0s'
    }

    let animClassName

    if (mode === APPEAR) {
      if (shouldAppear) animClassName = styles.appear
      else animClassName = styles.hide
    } else if (mode === HIDE) {
      if (shouldAppear) animClassName = styles.appear
      else animClassName = styles.hide
    }

    return (
      <div
        className={`${styles.fly} ${animClassName}`}
        style={style}
      >
        {
          (() => {
            if (component) return component
            else return [
              title && <TitleBar key={0} cart={title.cart} />,
              search && <SearchBar key={1} cart={search.cart} />
            ]
          })()
        }
      </div>
    )
  }

  state = {
    shouldAppear: false,
    forceHide: false,
  }

  render() {
    let { relative, fly } = this.props
    let style = {}

    if (fly && !relative) {
      style.paddingTop = 65
    }

    return (
      <div className={styles.container} >
        {this.renderFlyTopBar()}

        <div className={styles.content} style={{ ...style, ...this.props.style }} >
          {this.renderRelativeTopBar()}

          <div className={styles.wrapper} style={this.props.wrapperStyle}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default TopBar
//MODULES
import React, { Component } from 'react'

//STYLES
import styles from './css/slider.scss'

//COMPONENT
export default class Slider extends Component {
  componentDidMount() {
    this._mounted = true
    this.setState({zooms: this.props.items.map(() => 1)})
  }

  componentWillUnmount() {
    this._mounted = false
  }

  componentWillUpdate(props, state) {
    if (state.moveX !== this.state.moveX) {
      let moveX = state.moveX
      let maxWidth = this.container.clientWidth
      let length = this.props.items.length
      let half = maxWidth / 2

      let targetX = moveX % maxWidth < -half 
        ? Math.floor(moveX / maxWidth) * maxWidth 
        : Math.ceil(moveX / maxWidth) * maxWidth

      if (targetX > 0) targetX = 0
      else if (targetX < -(length - 1) * maxWidth) targetX = -maxWidth * (length - 1)
      
      let selected = targetX / -maxWidth

      if (selected != this.state.selected) this.setState({selected})
    }
  }

  renderItems() {
    let { items } = this.props

    return items.map((url, i) => {
      let width = `${100 / items.length}%`
      let { zooms } = this.state
      let zoom = zooms.length > i && this.state.isFullScreen ? zooms[i] : 1

      return (
        <div 
          className={styles.item} style={{width}} key={i} 
          style={{transform: `scaleY(${zoom})`}}
        >
          <img 
            src={url} alt="Item URL" className={styles.img} 
            style={{transform: `scaleX(${zoom})`}}
          />
        </div>
      )
    })
  }

  moveX = 0

  onTouchStart = e => {
    this.setState({
      startPosition: e.touches[0].pageX, 
      animate: false,
    })
  }

  prevX = 0
  nextX = 0
  difX = 0
  dir = 0

  onTouchMove = e => {
    let currentPosition = this.nextX = e.touches[0].pageX
    this.canFullScreen = false
    this.difX = this.nextX - this.prevX
    let range = 3
    
    this.setState({
      moveX: this.moveX = this.state.lastPosition + currentPosition - this.state.startPosition, 
      currentPosition,
    })

    if (this.difX < range && this.difX > -range) this.dir = 0
    else this.dir = this.difX

    this.prevX = this.nextX
  }

  chevronClick (to) {
    if (this.curAnim) clearTimeout(this.curAnim)
    
    let maxWidth = this.container.clientWidth
    let targetX = to * -maxWidth
    let length = this.props.items.length

    if (to < 0 || to > length - 1) return

    this.setState({
      lastPosition: targetX, 
      animate: true,
      targetX,
      moveX: this.moveX = targetX,
    }, () => this.curAnim = setTimeout(() => {
      if (this._mounted)
        this.setState({
          animate: false,
        })
    }, 3000))
  }

  onTouchEnd = () => {
    let maxWidth = this.container.clientWidth
    let length = this.props.items.length
    
    let targetX = this.dir < 0 
      ? Math.floor(this.moveX / maxWidth) * maxWidth 
      : Math.ceil(this.moveX / maxWidth) * maxWidth

    if (targetX > 0) targetX = 0
    else if (targetX < -(length - 1) * maxWidth) targetX = -maxWidth * (length - 1)

    this.setState({
      lastPosition: targetX, 
      animate: true,
      targetX,
      moveX: this.moveX = targetX,
    }, () => setTimeout(() => {
      if (this._mounted)
        this.setState({
          animate: false,
        })
    }, 3000))
  }

  renderBullets() {
    return this.props.items.map((url, i) => <div 
      key={i}
      className={`${styles.bullet} ${i === this.state.selected ? styles.active : ''}`}
      onClick={() => {
        this.chevronClick(i)
      }}
    />)
  }

  state = {
    startPosition: 0,
    currentPosition: 0,
    moveX: 0,
    startWrapperPosition: 0,
    animate: false,
    lastPosition: 0,
    selected: 0,
    isFullScreen: false,
    zooms: []
  }

  canFullScreen = false

  onMouseUp = () => {
    if (this.canFullScreen && Date.now() - this.dateDown < 1000) {
      this.setState({isFullScreen: true, zooms: this.state.zooms.map(() => 1)})
    }
  }

  zoomIn = () => {
    let { selected, zooms } = this.state
    let zoom = zooms[selected] + .5

    if (zoom > 3) zoom = 3
    zooms = zooms.slice()
    zooms[selected] = zoom
    this.setState({zooms})
  }

  zoomOut = () => {
    let { selected, zooms } = this.state
    let zoom = zooms[selected] - .5

    if (zoom < 1) zoom = 1
    zooms = zooms.slice()
    zooms[selected] = zoom
    this.setState({zooms})
  }

  render() {
    let {
      moveX,
      animate,
      targetX,
      selected,
      isFullScreen,
    } = this.state

    if (animate) moveX = targetX

    return (
      <div 
        className={styles.container} 
        ref={el => this.container = el} 
        style={{
          height: this.props.height || 350
        }}
      >
        <div 
          className={`${isFullScreen ? styles.fullscreen : ''} ${styles.content}`} 
        >
          <div 
            className={`${animate ? styles.animate : ''} ${styles.wrapper}`} 
            onTouchStart={this.onTouchStart} 
            onTouchMove={this.onTouchMove}
            onTouchEnd={this.onTouchEnd}
            onMouseDown={() => {
              this.dateDown = Date.now()
              this.canFullScreen = true
            }}
            onMouseUp={this.onMouseUp}
            style={{
              transform: `translateX(${moveX}px)`,
              width: `${this.props.items.length}00%`
            }}
            ref={el => this.wrapper = el}
          >
            {this.renderItems()}
          </div>
          
          <div 
            className={styles.left} 
            onClick={this.chevronClick.bind(this, selected - 1)}
          >
            <span className="mdi mdi-chevron-left" />
          </div>
          
          <div 
            className={styles.right} 
            onClick={this.chevronClick.bind(this, selected + 1)}
          >
            <span className="mdi mdi-chevron-right" />
          </div>

          <div className={styles.bullets} >
            {this.renderBullets()}
          </div>

          {
            isFullScreen
              ? (
                <React.Fragment>  
                  <span 
                    className={`${styles.zoomin} mdi mdi-magnify-plus-outline`} 
                    onClick={this.zoomIn}
                  />
                  <span 
                    className={`${styles.zoomout} mdi mdi-magnify-minus-outline`} 
                    onClick={this.zoomOut}
                  />
                  <div 
                    className={styles.close} 
                    onClick={() => this.setState({isFullScreen: false})}
                  >
                    &times;
                  </div>
                </React.Fragment>  
              )
              : ''
          }
        </div>
      </div>
    )
  }
}

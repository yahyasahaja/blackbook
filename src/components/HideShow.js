//MODULES
import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

//STYLES
import styles from './css/hide-show.scss'

//COMPONENT
@observer
export default class HideShow extends Component {
  @observable activator = []

  componentDidMount() {
    this.activator = this.props.data.map(() => false)
  }

  renderSub() {
    if (this.activator.slice().length === 0) return
    return this.props.data.map((dt, i) => {
      console.log(this.activator[i])
      return (
        <div key={i} className={styles.sub}>
          <div className={styles.title} onClick={() => this.activator[i] = !this.activator[i]} >
            <div>{dt.title}</div>
            <div className={`mdi mdi-chevron-${this.activator[i] ? 'up' : 'down'}`} />
          </div>

          <div className={`${styles[this.activator[i] ? 'show' : 'hide']} ${styles.content}`}>
            {this.activator[i] && (
              <div className={styles.wrapper} >
                {dt.content}
              </div>
            )}
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className={styles.container} >
        {this.renderSub()}
      </div>
    )
  }
}

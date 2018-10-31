//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

//STYLES
import styles from './css/index-hero.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import HideShow from '../../components/HideShow'

//STORE
import { appStack } from '../../services/stores'

const DATA = [
  {
    title: 'Bio',
    content: (
      <div>
        coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>
      </div>
    )
  },
  {
    title: 'Skill',
    content: (
      <div>
        coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>
      </div>
    )
  },
]

//COMPONENT
@observer
class Hero extends Component {
  @observable data = null
  @observable isLoading = false

  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  renderContent = () => {
    if (this.isLoading) return <div className={styles.loading} >
      <div>
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    </div>

    return (
      <div className={styles.container}>
        <HideShow data={DATA} />
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title={this.props.name} {...this.props}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default Hero
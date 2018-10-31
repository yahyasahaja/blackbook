//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import Slider from 'react-toolbox/lib/slider'
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

// [
//   {
//     title: 'Bio',
//     content: (
//       <div>
//         coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>
//       </div>
//     )
//   },
//   {
//     title: 'Abilities',
//     content: (
//       <div>
//         coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>
//       </div>
//     )
//   },
//   {
//     title: 'Tips and Tricks',
//     content: (
//       <div>
//         coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>coba<br/>
//       </div>
//     )
//   },
// ]

const DATA = {
  name: 'Legion Commander',
  bio: 'lorem impsum dolor sit amet',
  images: [
    '/static/img/sample.png',
    '/static/img/sample.png',
  ],
  status: [
    {
      strength: '20+2.20',
      agility: '18+1.70',
      intelligence: '26+2.90',
      attack: '35 - 39',
      speed: '315',
      armor: '1.52',
    },
    {
      strength: '22+2.20',
      agility: '20+1.70',
      intelligence: '28+2.90',
      attack: '37 - 40',
      speed: '400',
      armor: '1.59',
    },
    {
      strength: '20+2.20',
      agility: '18+1.70',
      intelligence: '26+2.90',
      attack: '35 - 39',
      speed: '315',
      armor: '1.52',
    },
    {
      strength: '22+2.20',
      agility: '20+1.70',
      intelligence: '28+2.90',
      attack: '37 - 40',
      speed: '400',
      armor: '1.59',
    },
  ],
  tips: '/static/video/sample.mp4',
  abilities: [
    {
      name: 'Overwhelming Odds',
      image: '/static/img/sample.png',
      description: 'Lorem impsum dolor sit amet',
      mana_cost: '100/110/120/130',
      cooldown: 15,
      video: '/static/video/sample.mp4',
    },
    {
      name: 'Overwhelming Odds',
      image: '/static/img/sample.png',
      description: 'Lorem impsum dolor sit amet',
      mana_cost: '100/110/120/130',
      cooldown: 15,
      video: '/static/video/sample.mp4',
    },
    {
      name: 'Overwhelming Odds',
      image: '/static/img/sample.png',
      description: 'Lorem impsum dolor sit amet',
      mana_cost: '100/110/120/130',
      cooldown: 15,
      video: '/static/video/sample.mp4',
    },
    {
      name: 'Overwhelming Odds',
      image: '/static/img/sample.png',
      description: 'Lorem impsum dolor sit amet',
      mana_cost: '100/110/120/130',
      cooldown: 15,
      video: '/static/video/sample.mp4',
    },
  ],
}

//COMPONENT
@observer
class Hero extends Component {
  @observable data = null
  @observable isLoading = false
  @observable currentLevel = 0

  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  renderStatus = () => {
    let stat = DATA.status[this.currentLevel]
    let dt = [
      'strength',
      'attack',
      'agility',
      'speed',
      'intelligence',
      'armor'
    ]

    return(
      <div className={styles.status}>
        {dt.map((d, i) => (
          <div key={i} className={styles.statwrap} >
            <img src={`/static/img/status/${d}.png`} alt=""/>
            <div>{stat[d]}</div>
          </div>
        ))}
      </div>
    )
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

    let data = [
      {
        title: 'Bio',
        content: (
          <div>
            {DATA.bio}
          </div>
        )
      },
      {
        title: 'Abilities',
        content: (
          <div>
            {DATA.bio}
          </div>
        )
      },
      {
        title: 'Tips and Trick',
        content: (
          <div>
            {DATA.bio}
          </div>
        )
      },
    ]

    return (
      <div className={styles.container}>
        <div className={styles.overview} >
          <div className={styles.left} >
            <div className={styles.image} ><img src={DATA.images[0]} alt=""/></div>
            <span className={styles.level} >Stat Level: {this.currentLevel + 1}</span>
            {this.renderStatus()}
            <div className={styles.slider} >
              <Slider 
                pinned min={0} max={DATA.status.length - 1} step={1} 
                value={this.currentLevel} 
                onChange={v => this.currentLevel = v} 
              />
            </div>
          </div>
        </div>
        <HideShow data={data} />
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title={DATA.name} {...this.props}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default Hero
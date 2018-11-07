//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import Slider from 'react-toolbox/lib/slider'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
// import { Parallax } from 'react-parallax'

//STYLES
import styles from './css/index-hero.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'
import theme from './css/theme.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import HideShow from '../../components/HideShow'

//STORE
import { appStack, user, hero } from '../../services/stores'

//UTILS
import { makeImageURL } from '../../utils'

//COMPONENT
@observer
class Hero extends Component {
  @observable data = null
  @observable currentLevel = 0
  @observable isSendingComment = false
  @observable comment = ''
  @observable attachedFile = null
  @observable isLoadingComments = false
  @observable isWriteCommentActive = true

  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  componentDidMount() {
    hero.fetchHero(this.props.match.params.id)
  }

  renderStatus = () => {
    if (!hero.singleHero) return

    let stat = hero.singleHero.statuses[this.currentLevel]
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

  renderCommentButton() {
    if (user.isLoggedIn) return (
      <div className={styles['not-logged-in']} >

      </div>
    )

    return (
      <div className={styles.write} >
        <button></button>
      </div>
    )
  }

  handleInput(event) {
    this.comment = event.target.value
    this.messageInput.style.height = ''
    this.messageInput.style.height =
      Math.min(this.messageInput.scrollHeight, 300) + 'px'
  }

  renderWriteComment() {
    return (
      <div className={styles.wrapper} >
        <div className={styles.attach} >
          <span className="mdi mdi-plus" />
        </div>

        <div className={styles.box} >
          <textarea 
            className={styles.textarea}
            ref={el => (this.messageInput = el)}
            onChange={this.handleInput.bind(this)}
            row={1}
            placeholder="Write a comment..."
            value={this.comment}
          />
        </div>

        <div className={styles.send} ><span className="mdi mdi-send" /></div>
      </div>
    )
  }

  @action
  openWriteComment = () => {
    this.isWriteCommentActive = true
    // auto focus
  }

  renderComments = () => {
    return (
      <div className={styles['comment-section']} >
        <div className={styles.title} >Comments</div>
        {this.renderCommentButton()}
        {hero.singleHero.comments.map((d, i) => {
          return (
            <div className={styles.comment} key={i} >
              <div className={styles.left} >
                <img src={d.user.profpic} alt=""/>
              </div>


              <div className={styles.right} >
                <div className={styles.name} >{d.user.name}</div>
                {d.video && (
                  <video width="400" controls>
                    <source src="mov_bbb.mp4" type="video/mp4" />
                    <source src="mov_bbb.ogg" type="video/ogg" />
                    Your browser does not support HTML5 video.
                  </video>
                )}
                {d.image && <img src={d.image} />}
                <div className={styles.content} >{d.comment}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  renderContent = () => {
    if (hero.isFetchingHero) return <div className={styles.loading} >
      <div>
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    </div>

    if (!hero.singleHero) return

    let data = [
      {
        title: 'Bio',
        content: (
          <div>
            {hero.singleHero.bio}
          </div>
        )
      },
      {
        title: 'Abilities',
        content: (
          <div>
            {hero.singleHero.bio}
          </div>
        )
      },
      {
        title: 'Tips and Trick',
        content: (
          <div>
            {hero.singleHero.bio}
          </div>
        )
      },
    ]

    return (
      <div className={styles.container}>
        <div className={styles.overview} >
          <div className={styles.left} >
            {/* <Parallax 
              bgImage={hero.singleHero.images[0]}
              strength={100}
            >
              <div style={{height: 200}} />
            </Parallax> */}
            <div className={styles.image} >
              <img src={makeImageURL(hero.singleHero.image_url)} alt=""/>
            </div>
            <span className={styles.level} >Stat Level: {this.currentLevel + 1}</span>
            {this.renderStatus()}
            <div className={styles.slider} >
              <Slider 
                pinned min={0} max={hero.singleHero.statuses.length - 1} step={1} 
                value={this.currentLevel} 
                onChange={v => this.currentLevel = v} 
                theme={theme}
              />
            </div>
          </div>
        </div>
        <HideShow data={data} />
        
        {this.renderComments()}
        <div style={{
          display: this.isWriteCommentActive ? 'block' : 'none'
        }} className={styles['write-comment']} >
          {this.renderWriteComment()}
        </div>
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title={hero.singleHero && hero.singleHero.name} {...this.props}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default Hero
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
import { appStack, user, hero, comment, dialog } from '../../services/stores'

//UTILS
import { makeImageURL, embedYoutubeURL } from '../../utils'

//COMPONENT
@observer
class Hero extends Component {
  @observable data = null
  @observable currentLevel = 1
  @observable isSendingComment = false
  @observable comment = ''
  @observable attachedFile = null
  @observable isLoadingComments = false
  @observable isWriteCommentActive = true
  @observable idToBeDeleted = 0

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

  actionDelete = [
    { label: 'Cancel', onClick: () => dialog.toggleActive() },
    { label: 'Delete', onClick: async () => {
      dialog.toggleActive()
      await comment.deleteComment(this.idToBeDeleted)
      hero.fetchHero(this.props.match.params.id, false)
    }},
  ]

  renderStatus = () => {
    if (!hero.singleHero) return

    let stat = hero.singleHero.statuses[this.currentLevel - 1]
    let dt = [
      'strength',
      'attack',
      'agility',
      'speed',
      'intelligence',
      'armor',
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
      <form className={styles.wrapper} onSubmit={async e => {
        e.preventDefault()
        let res = await comment.addComment(
          {
            comment: this.comment,
            heroId: hero.singleHero.id
          }, 
          this.attachedFile
        )

        if (res) {
          this.comment = ''
          this.commentInput.value = ''
          this.attachedFile = null
          hero.fetchHero(this.props.match.params.id, false)
        }
      }} >
        <label htmlFor="pic" className={styles.pic} >
          <div className={styles.attach} >
            <span className="mdi mdi-plus" />
          </div>
          <input
            id="pic" name="pic" type="file" style={{ display: 'none' }}
            ref={el => this.commentInput = el}
            onChange={e => this.attachedFile = e.target.files[0]}
            accept=".jpg, .jpeg, .png"
            disabled={comment.isLoading}
          />
        </label>

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

        {
          comment.isLoading
            ? (
              <div className={styles['loading-wrapper']} >
                <ProgressBar
                  className={styles.loading}
                  type='circular'
                  mode='indeterminate' theme={ProgressBarTheme}
                />
              </div>
            )
            : (
              <button type="submit" className={styles.send} >
                <span className="mdi mdi-send" />
              </button>
            )
        }
      </form>
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
                <img src={makeImageURL(d.user.profpic_url)} alt=""/>
              </div>


              <div className={styles.right} >
                <div className={styles.upper} >
                  <div className={styles.name} >{d.user.name}</div>

                  <div className={styles.menu} >
                    <div className={`${styles.icon} mdi mdi-pencil`} />
                    <div 
                      className={`${styles.icon} mdi mdi-delete`} 
                      onClick={() => {
                        console.log('kepanggil?')
                        this.idToBeDeleted = d.id
                        dialog.show('Delete this comment?', '', this.actionDelete)
                      }}
                    />
                  </div>
                </div>
                
                {d.image_url && (
                  <img className={styles.img} src={makeImageURL(d.image_url)} alt=""/>
                )}
                {d.video_url && (
                  <video width="100%" controls>
                    <source src={makeImageURL(d.video_url)} type="video/mp4" />
                    <source src={makeImageURL(d.video_url)} type="video/ogg" />
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

  renderAbilities = () => {
    return (
      <div className={styles.abilities} >
        {hero.singleHero.abilities.map((d, i) => {
          return (
            <div className={styles.ability} key={i}  >
              <div className={styles.up} >
                <div className={styles.left} >
                  <img src={makeImageURL(d.image_url)} alt=""/>
                </div>

                <div className={styles.right} >
                  <div className={styles.name} >{d.name}</div>
                  <div className={styles.mana} >{d.mana}</div>
                  <div className={styles.cooldown} >{d.cooldown}</div>
                </div>
              </div>

              <div className={styles.down} >
                <span dangerouslySetInnerHTML={{__html: d.description}} />
              </div>

              <iframe width="100%" height="200" src={embedYoutubeURL(d.video_url)} />
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
        content: this.renderAbilities()
      },
      {
        title: 'Tips and Trick',
        content: (
          <div>
            <span>{hero.singleHero.tips_desc}</span>
            <iframe width="100%" height="200" src={embedYoutubeURL(hero.singleHero.tips_video_url)} />
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
            <span className={styles.level} >Stat Level: {this.currentLevel}</span>
            {this.renderStatus()}
            <div className={styles.slider} >
              <Slider 
                pinned min={1} max={hero.singleHero.statuses.length} step={1} 
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
//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import Slider from 'react-toolbox/lib/slider'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { Link } from 'react-router-dom'
// import { Parallax } from 'react-parallax'

//STYLES
import styles from './css/index-hero.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'
import theme from './css/theme.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import HideShow from '../../components/HideShow'

//STORE
import { appStack, user, hero, comment, dialog, overlayLoading, snackbar } from '../../services/stores'

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
      let res = await comment.deleteComment(this.idToBeDeleted)
      hero.fetchHero(this.props.match.params.id, false)
      if (!res) snackbar.show('There\'s an error occured')
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
    if (!user.isLoggedIn) return (
      <div className={styles['not-logged-in']} >
        <Link to="/auth/login" >Login to Comment</Link>
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
          this.messageInput.style.height = ''
          this.messageInput.style.height =
            Math.min(this.messageInput.scrollHeight, 300) + 'px'
        } else snackbar.show('There\'s an error occured')
      }} >
        <label htmlFor="pic" className={styles.pic} >
          <div className={styles.attach} >
            <span className="mdi mdi-plus" />
          </div>
          <input
            id="pic" name="pic" type="file" style={{ display: 'none' }}
            ref={el => this.commentInput = el}
            onChange={e => this.attachedFile = e.target.files[0]}
            accept=".jpg, .jpeg, .png, .mkv, .mp4, .ogg, .m4v, .avi, .mpg, .webm"
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

  @observable editCommentText = ''
  @observable commentIndexToBeEditted = -1
  renderComments = () => {
    return (
      <div className={styles['comment-section']} >
        <div className={styles.title} >Comments</div>
        {this.renderCommentButton()}
        {hero.singleHero.comments.map((d, i) => {
          return (
            <div className={styles.comment} key={i} >
              <div className={styles.left} >
                {
                  d.user.profpic_url
                    ? (
                      <img src={makeImageURL(d.user.profpic_url)} alt=""/>
                    )
                    : (
                      <div className={styles['picture-default']}>
                        <span>
                          {d.user.name
                            .split(' ')
                            .slice(0, 2)
                            .map(v => v[0])
                            .join('')}
                        </span>
                      </div>
                    )
                }
              </div>

              <div className={styles.right} >
                <div className={styles.upper} >
                  <div className={styles.name} >{d.user.name}</div>

                  <div className={styles.menu} >
                    <div 
                      className={`${styles.icon} mdi mdi-pencil`} 
                      onClick={() => {
                        this.commentIndexToBeEditted = i
                        this.editCommentText = d.comment
                        if (this.editCommentInput) this.editCommentInput.focus()
                      }}  
                    />
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
                {
                  comment.isUpdatingComment 
                    ? (
                      <div className={styles['loading-wrapper']} >
                        <ProgressBar
                          className={styles.loading}
                          type='circular'
                          mode='indeterminate' theme={ProgressBarTheme}
                        />
                      </div>
                    )
                    : this.commentIndexToBeEditted != -1 && i === this.commentIndexToBeEditted
                      ? (
                        <div className={styles['edit-comment']}>
                          <textarea 
                            value={this.editCommentText}
                            onChange={e => this.editCommentText = e.target.value}
                            ref={el => this.editCommentInput = el}
                          />
                          <div className={styles.actions} >
                            <button 
                              onClick={() => this.commentIndexToBeEditted = -1} 
                            >
                              Cancel
                            </button>
                            <button onClick={async () => {
                              let res = await comment.updateComment({
                                id: d.id,
                                comment: this.editCommentText
                              })
                              this.commentIndexToBeEditted = -1
                              hero.fetchHero(this.props.match.params.id, false)
                              if (!res) snackbar.show('There\'s an error occured')
                            }} >Edit</button>
                          </div>
                        </div>
                      )
                      : (
                        <div 
                          className={styles.content} 
                          dangerouslySetInnerHTML={{__html: d.comment}} 
                        />
                      )
                }
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
          {user.isLoggedIn && user.data && user.data.role === 'ADMIN' && this.renderWriteComment()}
        </div>
      </div>
    )
  }

  actions = [
    { label: 'Cancel', onClick: () => dialog.toggleActive() },
    { label: 'Ok', onClick: async () => {
      if (hero.singleHero && hero.singleHero.id) {
        overlayLoading.show()
        await hero.deleteHero(hero.singleHero.id)
        overlayLoading.hide()
        dialog.toggleActive() 
        this.props.history.push('/home')
      }
    }}
  ]

  render() {
    let icons = []

    if (user.isLoggedIn && user.data && user.data.role === 'ADMIN') {
      icons = [
        {
          icon: 'delete',
          to: '',
          onClick: e => {
            e.preventDefault()
            dialog.show('Delete This Hero?', 'Are you sure?', this.actions)
          }
        },
        {
          icon: 'pencil',
          to: `/hero/${hero.singleHero && hero.singleHero.id}/edit`
        }
      ]
    }
    return (
      <PopupBar
        title={hero.singleHero && hero.singleHero.name} {...this.props}
        icons={icons}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default Hero
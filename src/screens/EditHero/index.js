//MODULES
import React, { Component } from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
// import _ from 'lodash'
import { observer } from 'mobx-react'
import Input from 'react-toolbox/lib/input/Input'
import Slider from 'react-toolbox/lib/slider'

//STYLES
import styles from './css/index-edit-hero.scss'
import ProgressBarTheme from '../../assets/css/theme-progress-bar.scss'
import theme from '../../assets/css/theme.scss'
import sliderTheme from '../Hero/css/theme.scss'

//COMPONENTS
import PopupBar, { ANIMATE_HORIZONTAL } from '../../components/PopupBar'
import PrimaryButton from '../../components/PrimaryButton'
// import loadingTheme from '../Chat/css/loading-submit.scss'

//STORE
import { user, snackbar, appStack, hero } from '../../services/stores'
import { observable } from 'mobx'
import UploadImage from '../../components/UploadImage'

//COMPONENT
@observer
class EditHero extends Component {
  @observable isEdit = false
  @observable image = null
  @observable image_url = ''
  @observable name = ''
  @observable bio = ''
  @observable tips_desc = ''
  @observable tips_video_url = ''
  @observable abilities = [
    {
      image: null,
      name: '',
      description: '',
      mana: '',
      cooldown: '',
      video_url: ''
    },
    {
      image: null,
      name: '',
      description: '',
      mana: '',
      cooldown: '',
      video_url: ''
    },
    {
      image: null,
      name: '',
      description: '',
      mana: '',
      cooldown: '',
      video_url: ''
    }
  ]
  @observable statuses = []
  @observable currentLevel = 1

  constructor(props) {
    super(props)
    this.id = appStack.push()
  }

  componentWillUnmount() {
    appStack.pop()
  }

  async componentDidMount() {
    if (location.pathname.indexOf('edit') !== -1) this.isEdit = true
    
    if (!this.isEdit) {
      for (let i = 0; i < 25; i++) {
        this.statuses.push({
          level: i + 1,
          'strength': '',
          'attack': '',
          'agility': '',
          'speed': '',
          'intelligence': '',
          'armor': '',
        })
      }
    } else {
      let id = this.props.match.params.id
      let res = await hero.fetchHero(id)

      if (res) {
        res = { ...res }
        for (let attr in res) this[attr] = res[attr]

        for (let ability of res.abilities) {
          ability.description = ability.description.replace(/<br\s*[/]?>/gi, '\n') 
          ability.image = observable(null)
        }
          
        window.abilities = this.abilities
      } else {
        snackbar.show(`Hero with id ${id} is not exist`)
        this.props.history.push('/home')
      }
    }
  }

  renderStatuses() {
    let stat = this.statuses[this.currentLevel - 1]

    if (!stat) return

    let dt = [
      'strength',
      'attack',
      'agility',
      'speed',
      'intelligence',
      'armor',
    ]

    return(
      <div className={styles['statuses-wrapper']} >
        <div className={styles.text} >Status Level {this.currentLevel}</div>
        <div className={styles.statuses}>
          {dt.map((d, i) => (
            <div key={i} className={styles.statwrap} >
              <img src={`/static/img/status/${d}.png`} alt=""/>
              <div className={styles.inputwrap}>
                <Input
                  name="name"
                  type="text"
                  label="Name"
                  onChange={v => stat[d] = v}
                  value={stat[d]}
                  theme={theme}
                  required
                />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.slider} >
          <Slider 
            pinned min={1} max={25} step={1} 
            value={this.currentLevel} 
            onChange={v => this.currentLevel = v} 
            theme={sliderTheme}
          />
        </div>
      </div>
    )
  }
  
  renderContent = () => {
    return (
      <div className={styles.container} >
        <UploadImage
          onChange={file => this.image = file}
          className={styles['hero-image']}
          title="Select Hero Image"
          defaultImage={this.image_url}
        />

        <Input
          name="name"
          type="text"
          label="Name"
          onChange={e => this.name = e}
          value={this.name}
          theme={theme}
          required
        />
        
        <Input
          name="bio"
          type="text"
          label="Bio"
          onChange={e => this.bio = e}
          value={this.bio}
          theme={theme}
          multiline
          required
        />

        <Input
          name="tips"
          type="text"
          label="Tips Description"
          onChange={e => this.tips_desc = e}
          value={this.tips_desc}
          theme={theme}
          required
        />

        <Input
          name="tips_video"
          type="text"
          label="Tips Video URL"
          onChange={e => this.tips_video_url = e}
          value={this.tips_video_url}
          theme={theme}
          required
        />

        {this.renderStatuses()}

        <div className={styles.abilities} >
          <span className={styles.text} >Abilities</span>
          {
            this.abilities.slice().map((ability, i) => {
              return (
                <div key={i} className={styles.ability} >
                  <UploadImage
                    onChange={file => this.abilities[i].image = observable(file)}
                    className={styles['ability-image']}
                    title="Select Ability Image"
                    defaultImage={ability.image_url}
                  />
                  <Input
                    name="name"
                    type="text"
                    label="Name"
                    onChange={e => ability.name = e}
                    value={ability.name}
                    theme={theme}
                    required
                  />
                  <Input
                    name="desc"
                    type="text"
                    label="Description"
                    onChange={e => ability.description = e}
                    value={ability.description}
                    theme={theme}
                    required
                    multiline
                  />
                  <Input
                    name="mana"
                    type="text"
                    label="Mana Point"
                    onChange={e => ability.mana = e}
                    value={ability.mana}
                    theme={theme}
                    required
                  />
                  <Input
                    name="cooldown"
                    type="text"
                    label="Cooldown"
                    onChange={e => ability.cooldown = e}
                    value={ability.cooldown}
                    theme={theme}
                    required
                  />
                  <Input
                    name="video"
                    type="text"
                    label="Video URL"
                    onChange={e => ability.video_url = e}
                    value={ability.video_url}
                    theme={theme}
                    required
                  />
                </div>
              )
            })
          }
        </div>

        {this.renderButton()}
      </div>
    )
  }

  renderButton() {
    if (user.isLoadingUpdateEditHero) return (
      <div className={styles['loading-wrapper']} >
        <ProgressBar
          className={styles.loading}
          type='circular'
          mode='indeterminate' theme={ProgressBarTheme}
        />
      </div>
    )

    return (
      <div className={styles.button} >
        <PrimaryButton
          className={styles.button}
          type="submit"
          onClick={async () => {
            let {
              image,
              name,
              bio,
              tips_desc,
              tips_video_url,
              abilities,
              statuses,
              image_url
            } = this
            
            abilities = abilities.slice().map(({
              name,
              image_url,
              description,
              mana,
              cooldown,
              video_url,
              image,
            }) => {
              return {
                name,
                image_url,
                description,
                mana,
                cooldown,
                video_url,
                image
              }
            })
            
            statuses = statuses.slice().map(({
              level,
              strength,
              attack,
              agility,
              speed,
              intelligence,
              armor,
            }) => {
              return {
                level,
                strength,
                attack,
                agility,
                speed,
                intelligence,
                armor,
              }
            })
            
            if (this.isEdit) {
              console.log(abilities)
              let res = await hero.updateHero({
                id: this.props.match.params.id,
                image,
                image_url,
                name,
                bio,
                tips_desc,
                tips_video_url,
                abilities,
                statuses,
              })

              snackbar.show(res ? 'Hero updated' : 'Failed to update hero')
            } else {
              let res = await hero.addHero({
                image,
                image_url,
                name,
                bio,
                tips_desc,
                tips_video_url,
                abilities,
                statuses,
              })

              snackbar.show(res ? 'Hero is successfuly added' : 'Failed to add hero')
            }
          }}
        >
          {this.isEdit ? 'Update' : 'Save New'} Hero
        </PrimaryButton>
      </div>
    )
  }

  render() {
    return (
      <PopupBar
        title="Profil" {...this.props}
        renderContent={this.renderContent}
        anim={ANIMATE_HORIZONTAL}
      />
    )
  }
}

export default EditHero

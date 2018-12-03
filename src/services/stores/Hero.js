//MODULES
import { observable, action } from 'mobx'
import gql from 'graphql-tag'

//CLIENT
import client from '../graphql/client'
import { uploads } from '.'

//STORE
class Hero {
  @observable isFetchingAllheroes = false
  @observable allHeroes = []
  @observable isFetchingHero = false
  @observable singleHero = null
  @observable isAddingHero = false
  @observable isUpdateingHero = false
  @observable isDeletingHero = false

  validateStatuses(statuses) {
    let res = []
    for (let status of statuses) {
      if (status.attack) res.push(status)
    }
    return res
  }

  @action
  async addHero(variables) {
    try {
      this.isUpdateingHero = true
      variables.abilities = variables.abilities.map(async ability => {
        let newAbility = {
          ...ability,
          description: ability.description.replace(/(?:\r\n|\r|\n)/g, '<br>')
        }
        if (ability.image && ability.image.value)  {
          ability.image_url = await uploads.singleUpload(ability.image.value)
        }
        delete ability.image
        return newAbility
      })

      if (variables.image) variables.image_url = await uploads.singleUpload(variables.image)

      let statuses = variables.statuses
      variables.statuses = this.validateStatuses(statuses)

      let {
        data: {
          addHero: {
            id
          }
        }
      } = await client.mutate({
        mutation: addHeroQuery,
        variables
      })
      this.isAddingHero = false
      return id
    } catch (err) {
      console.log('ERROR WHILE ADDING HERO', err)
      this.isAddingHero = false
    }
  }

  @action
  async updateHero(variables) {
    try {
      this.isUpdateingHero = true
      variables.abilities = variables.abilities.map(async ability => {
        let newAbility = {
          ...ability,
          description: ability.description.replace(/(?:\r\n|\r|\n)/g, '<br>')
        }
        if (ability.image && ability.image.value)  {
          ability.image_url = await uploads.singleUpload(ability.image.value)
        }
        delete ability.image
        return newAbility
      })

      if (variables.image) variables.image_url = await uploads.singleUpload(variables.image)

      let {
        data: {
          updateHero: {
            id
          }
        }
      } = await client.mutate({
        mutation: updateHeroQuery,
        variables
      })
      this.isUpdateingHero = false
      return id
    } catch (err) {
      console.log('ERROR WHILE ADDING HERO', err)
      this.isUpdateingHero = false
    }
  }

  @action
  async deleteHero(id) {
    try {
      this.isDeletingHero = true
      let {
        data: {
          deleteHero: res
        }
      } = await client.mutate({
        mutation: deleteHeroQuery,
        variables: {
          id
        }
      })
      this.isDeletingHero = false
      return res
    } catch (err) {
      console.log('ERROR WHILE ADDING HERO', err)
      this.isDeletingHero = false
    }
  }
  
  @action
  async fetchAllHeroes() {
    try {
      let {
        data: {
          allHeroes
        }
      } = await client.query({
        query: allHeroesQuery,
      })

      return this.allHeroes = allHeroes
    } catch (err) {
      console.log('ERROR WHILE FETCHING USER DATA', err)
      return false
    }
  }

  @action
  async fetchHero(id, withLoading = true) {
    try {
      if (withLoading) this.isFetchingHero = true
      let {
        data: {
          hero
        }
      } = await client.query({
        query: heroQuery,
        variables: {
          id
        },
        fetchPolicy: 'network-only'
      })
      
      let loc = hero.statuses.sort((a, b) => a.level - b.level).slice()
      let res = []
      let i = 0
      for (i = 0; i < loc.length - 1; i++) {
        res.push(loc[i])
        let minLevel = loc[i].level
        let maxLevel = loc[i + 1].level
        let bandingLevel = maxLevel - minLevel
        
        for (let j = minLevel + 1; j < maxLevel; j++) { //yg ditanya
          let obj = {}
          for (let stat in loc[i]) {
            let minStat = loc[i][stat]
            let maxStat = loc[i + 1][stat]
            let bandingStat = maxStat - minStat

            let convertedLevel = j - minLevel
            let kali = bandingStat / bandingLevel
            obj[stat] = Number((kali * convertedLevel) + minStat).toFixed(2)
          }

          res.push(obj)
        }
      }
      res.push(loc[i])
      
      let finalHero = { ...hero, statuses: res}
      this.singleHero = finalHero

      this.isFetchingHero = false
      return this.singleHero
    } catch (err) {
      console.log('ERROR WHILE FETCHING USER DATA', err)
      return this.isFetchingHero = false
    }
  }
}

const deleteHeroQuery = gql`
  mutation deleteHero($id: ID!) {
    deleteHero(id: $id) 
  }
`

const updateHeroQuery = gql`
  mutation updateHero(
    $id: ID!
    $name: String
    $image_url: String
    $bio: String
    $tips_desc: String
    $tips_video_url: String
    $abilities: [AbilitiesInput]
    $statuses: [StatusesInput]
  ) {
      updateHero (
        id: $id
        name: $name
        image_url: $image_url
        bio: $bio
        tips_desc: $tips_desc
        tips_video_url: $tips_video_url
        abilities: $abilities
        statuses: $statuses
      ) {
        id
      }
  }
`

const addHeroQuery = gql`
  mutation addHero(
    $name: String!
    $image_url: String!
    $bio: String!
    $tips_desc: String!
    $tips_video_url: String!
    $abilities: [AbilitiesInput!]!
    $statuses: [StatusesInput!]!
  ) {
      addHero (
        name: $name
        image_url: $image_url
        bio: $bio
        tips_desc: $tips_desc
        tips_video_url: $tips_video_url
        abilities: $abilities
        statuses: $statuses
      ) {
        id
      }
  }
`

const allHeroesQuery = gql`
  query allHeroes {
    allHeroes {
      id
      image_url
    }
  }
`

const heroQuery = gql`
  query hero($id: ID!) {
    hero (id: $id) {
      id
      name
      image_url
      bio
      tips_desc
      tips_video_url
      abilities {
        id
        name
        image_url
        description
        mana
        cooldown
        video_url
      }
      statuses {
        id
        level
        strength
        attack
        agility
        speed
        intelligence
        armor
      }
      comments {
        id
        comment
        video_url
        image_url
        user {
          id
          name
          profpic_url
        }
      }
    }
  }
`

// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default window.hero = new Hero()
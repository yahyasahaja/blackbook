//MODULES
import { observable, action } from 'mobx'
import gql from 'graphql-tag'

//CLIENT
import client from '../graphql/client'

//STORE
class Hero {
  @observable isFetchingAllheroes = false
  @observable allHeroes = []
  @observable isFetchingHero = false
  @observable singleHero = null
  
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
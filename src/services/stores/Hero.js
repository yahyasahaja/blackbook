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
  async fetchHero(id) {
    try {
      let {
        data: {
          hero
        }
      } = await client.query({
        query: heroQuery,
        variables: {
          id
        }
      })

      return hero
    } catch (err) {
      console.log('ERROR WHILE FETCHING USER DATA', err)
      return false
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
        user
      }
    }
  }
`

// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default window.hero = new Hero()
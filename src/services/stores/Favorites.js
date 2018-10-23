//MODULES
import { observable, action } from 'mobx'
import badges from './Badges'
import gql from 'graphql-tag'
import client from '../graphql/productClient'

//CONFIG
import { FAVORITES_STORAGE_URI } from '../../config'

import user from './User'
// import overlayLoading from './OverlayLoading'

//STORE
class Favorites {
  @observable data = []
  @observable isLoading = false

  @action
  async fetchData() {
    if (!user.isLoggedIn) return
    try {
      this.isLoading = true 

      const {
        data: { 
          myFavoriteProducts: {
            products
          }
        }
      } = await client.query({
        query: myFavoriteProducts,
        fetchPolicy: 'network-only'
      })
      this.isLoading = false
      this.data.replace(products.map(d => ({
        ...d, image: d.images.length > 0 ? d.images[0].url : null
      })))
      badges.set(badges.LIKED, this.data.length)
    } catch(e) {
      console.log('ERROR WHILE FETCHING FAVORITES', e)
    }
  }

  @action
  async add(arg) {
    let state = this.data.slice()
    for (let i in state) if (state[i].id == arg.id) return
    (state = state.slice()).push(arg)

    try {
      this.isLoading = true 
      await client.mutate({
        mutation: favoriteProduct,
        variables: {
          input: {
            productIds: [arg.id]
          }
        },
      })
      this.isLoading = false
      
      this.data.replace(state)
      badges.set(badges.LIKED, this.data.length)
      // window.localStorage.setItem('favorites', JSON.stringify(state))
    } catch (e) {
      console.log('ERROR WHILE ADDING FAVORITE', e)
    }
  }

  @action
  async remove(id) {
    let state = this.data.slice()
    
    for (let i in state) if (state[i].id == id) {
      state.splice(i, 1)
      break
    }

    try {
      this.isLoading = true
      const {
        data: result
      } = await client.mutate({
        mutation: unfavoriteProduct,
        variables: {
          input: {
            productIds: [id]
          }
        },
      })
      this.isLoading = false

      console.log(result)
      this.data.replace(state)
      badges.set(badges.LIKED, this.data.length)
      // window.localStorage.setItem('favorites', JSON.stringify(state))
    } catch (e) {
      console.log('ERROR WHILE ADDING FAVORITE', e)
    }
  }

  @action
  clear() {
    this.data = []
    badges.set(badges.LIKED, 0)
    localStorage.removeItem(FAVORITES_STORAGE_URI)
  }
}

const favoriteProduct = gql`
  mutation favoriteProduct($input: FavoriteProductInput!) {
    favoriteProduct ( input: $input )
  }
  
`

const unfavoriteProduct = gql`
  mutation unfavoriteProduct($input: FavoriteProductInput!) {
    unfavoriteProduct ( input: $input )
  }
`

const myFavoriteProducts = gql`
  query myFavoriteProducts($limit: Int, $offset: Int) {
    myFavoriteProducts ( limit: $limit, offset: $offset ) {
      totalCount
      products {
        id
        name
        price {
          value
          currency
        }
        variants {
          name
        }
        images {
          url
        }
        seller {
          id
        }
        shareUrl
        liked
        favorited
        sold
      }
    }
  }
`

export default window.fav = new Favorites()
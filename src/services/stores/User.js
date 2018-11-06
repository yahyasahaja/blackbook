//MODULES
import { observable, action, computed } from 'mobx'
import gql from 'graphql-tag'

//TOKENS
import token from './Token'

//CLIENT
import client from '../graphql/client'

//STORE
class User {
  @observable isFetchingUser = false
  @observable data = null
  @observable isLoadingLoggedIn = false

  @computed
  get isLoggedIn() {
    return !!this.data
  }

  @action
  async login (email, password) {
    try {
      this.isLoadingLoggedIn = true
      let {
        data: {
          login: authToken
        } 
      } = await client.mutate({
        mutation: loginQuery,
        variables: {
          email,
          password 
        }
      })
        
      token.setAuthToken(authToken)
      let user = await this.fetchData()
      this.isLoadingLoggedIn = false

      return user
    } catch (err) {
      console.log('ERROR WHILE LOGIN', err)
      this.isLoadingLoggedIn = false
      return false
    }
  }

  @action
  async register (name, email, password) {
    try {
      this.isLoadingLoggedIn = true
      let {
        data: {
          register: authToken
        } 
      } = await client.mutate({
        mutation: registerQuery,
        variables: {
          name,
          email,
          password 
        }
      })
        
      token.setAuthToken(authToken)
      let user = await this.fetchData()
      this.isLoadingLoggedIn = false

      return user
    } catch (err) {
      console.log('ERROR WHILE LOGIN', err)
      this.isLoadingLoggedIn = false
    }
  }

  @action
  async fetchData() {
    if (!token.rawAuthToken) return
    try {
      let {
        data: {
          user
        }
      } = await client.query({
        query: userQuery,
      })

      return this.data = user
    } catch (err) {
      console.log('ERROR WHILE FETCHING USER DATA', err)
      return false
    }
  }

  @action
  logout = async () => {
    this.data = null
    token.removeAuthToken()
  }

  @observable isLoadingUpdateUser = false
  @action
  async updateUser(data) {
    try {
      this.isLoadingUpdateUser = true
      await client.mutate({
        mutation: updateUserQuery,
        variables: data
      })
      this.isLoadingUpdateUser = false
      return true
    } catch (err) {
      console.log('ERROR WHILE LOGIN', err)
      this.isLoadingUpdateUser = false
    }
  }
}

const registerQuery = gql`
  mutation register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password, role: ADMIN)
  }
`

const loginQuery = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

const userQuery = gql`
  query user {
    user {
      id
      name
      email
      role 
      profpic_url
    }
  }
`

const updateUserQuery = gql`
  mutation updateUser(
    $email: String
    $name: String
    $newPassword: String
    $currentPassword: String
    $profpic_url: String
  ) {
    updateUser(
      email: $email
      name: $name
      newPassword: $newPassword
      currentPassword: $currentPassword
      profpic_url: $profpic_url
    ) {
      id
    }
  }
`

// autorun(() => console.log('DARI AUTORUN', window.badges.data))
export default window.user = new User()
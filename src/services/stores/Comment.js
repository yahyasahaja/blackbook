//MODULES
import { observable, action } from 'mobx'
import gql from 'graphql-tag'

//CLIENT
import client from '../graphql/client'

//STORES
import uploads from './Uploads'

//STORE
class Comment {
  @observable isLoading = false
  @observable isUpdatingComment = false

  @action
  async addComment(variables, file) {
    try {
      if (variables.comment === '') return
      this.isLoading = true
      let videos = ['m4v', 'avi','mpg','mp4', 'webm'] 
      // let images = ['jpg', 'gif', 'bmp', 'png']
      let isVideo = false


      if (file) {
        let path = null
        for (let tipe of videos) if (file.type.indexOf(tipe) !== -1) isVideo = true

        path = await uploads.singleUpload(file)
        if (path) variables[isVideo ? 'video_url' : 'image_url'] = path
      }
      

      let {
        data: {
          addComment: res
        }
      } = await client.mutate({
        mutation: addCommentQuery,
        variables
      })

      this.isLoading = false
      return res
    } catch (err) {
      console.log('ERROR WHILE ADDING COMMENT', err)
      this.isLoading = false
    }
  }

  @action
  async updateComment(variables) {
    try {
      this.isUpdatingComment = true

      let {
        data: {
          updateComment: res
        }
      } = await client.mutate({
        mutation: updateCommentQuery,
        variables
      })

      this.isUpdatingComment = false
      return res
    } catch (err) {
      console.log('ERROR WHILE UPDATING COMMENT', err)
      this.isUpdatingComment = false
    }
  }

  @action
  async deleteComment(id) {
    try {
      this.isLoading = true

      let {
        data: {
          deleteComment: res
        }
      } = await client.mutate({
        mutation: deleteCommentQuery,
        variables: {
          id
        }
      })

      this.isLoading = false
      return res
    } catch (err) {
      console.log('ERROR WHILE DELETING COMMENT', err)
      this.isLoading = false
    }
  }
}

const updateCommentQuery = gql`
  mutation updateComment(
    $id: ID!
    $comment: String!
    $video_url: String
    $image_url: String
  ) {
    updateComment(
      id: $id
      comment: $comment
      video_url: $video_url
      image_url: $image_url
    ) {
      id
    }
  }
`

const addCommentQuery = gql`
  mutation addComment(
    $heroId: ID!
    $comment: String!
    $video_url: String
    $image_url: String
  ) {
    addComment(
      heroId: $heroId
      comment: $comment
      video_url: $video_url
      image_url: $image_url
    ) {
      id
    }
  }
`

const deleteCommentQuery = gql`
  mutation deleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`

export default window.comment = new Comment()
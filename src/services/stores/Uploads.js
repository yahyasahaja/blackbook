//MODULES
import { observable, action } from 'mobx'
import gql from 'graphql-tag'

//CLIENT
import client from '../graphql/client'

//STORE
class Uploads {
  @observable isUploading = false

  @action 
  async singleUpload(file) {
    try {
      this.isUploading = true
      console.log(file)
      let {
        data: {
          singleUpload: {
            path
          }
        }
      } = await client.mutate({
        mutation: singleUploadQuery,
        variables: {
          file
        }
      })
      this.isUploading = false

      return path
    } catch (err) {
      console.log('ERROR WHILE UPLOADING A FILE', err)
      this.isUploading = false
    }
  }
}

const singleUploadQuery = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      id
      path
    }
  }
`

export default window.uploads = new Uploads()
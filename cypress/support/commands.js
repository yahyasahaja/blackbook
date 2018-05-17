export const IAM_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net'
export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

Cypress.Commands.add('login', () => {
  const msisdn = '8863'
  const password = btoa('12qwaszx')

  cy.request({
    url: `${IAM_ENDPOINT_URL}/login`,
    method: 'POST',
    body: {
      msisdn,
      password,
    },
  }).its('body').then(body => {
    localStorage.setItem(AUTHORIZATION_TOKEN_STORAGE_URI, body.data)
  })

  cy.reload()
})

Cypress.Commands.add('upload_file', (fileName, selector) => {
  cy.get(selector).then(subject => {
    cy.fixture(fileName, 'base64').then((content) => {
      const el = subject[0]
      const blob = b64toBlob(content)
      const testFile = new File([blob], fileName)
      const dataTransfer = new DataTransfer()

      dataTransfer.items.add(testFile)
      el.files = dataTransfer.files
    })
  })
})

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || ''
  sliceSize = sliceSize || 512

  var byteCharacters = atob(b64Data)
  var byteArrays = []

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  var blob = new Blob(byteArrays, { type: contentType })
  blob.lastModifiedDate = new Date()
  return blob
}

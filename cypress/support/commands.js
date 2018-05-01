export const IAM_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net'
export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

Cypress.Commands.add('login', () => {
  const msisdn = '6283333333333'
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
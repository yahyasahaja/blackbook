export const IAM_ENDPOINT_URL = 'https://iam-message-testing.azurewebsites.net'
export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

describe('Chat page', () => {
  it('Visits the chat page', () => {
    cy.visit('/')
    cy.url().should('include', '/home')
    cy.login()
    cy.get('a[href="/chat"]').click()
    cy.url().should('include', '/chat')
  })

  it('Chat with seller from chat page', () => {
    cy.get('a[href="/chat"]').click()
    cy.wait(3000)
    cy.get('[class^="thread-item"]').eq(0).click()
    const dateNow = 'Test chat on '+new Date().toString()
    cy.get('textarea').type(dateNow)
    cy.get('textarea').siblings('button').click()
    cy.wait(3000)
    cy.get('[class^="conversation--bubble"]').last().should('contain', dateNow)
  })

  it('Chat with seller from homepage', () => {
    cy.visit('/')
    cy.url().should('contain', '/home')
    cy.login()
    cy.get('div[data-testid="product-card"]').eq(0).find('div[data-testid="product-card-action"] > div').as('productCardAction1')
    cy.get('@productCardAction1').eq(0).find('a[data-testid="chat"]').click()
    cy.url().should('contain', '/chat/new')
    cy.wait(3000)
    const dateNow = 'Test chat on '+new Date().toString()
    cy.get('textarea').type(dateNow)
    cy.get('textarea').siblings('button').click()
    cy.wait(3000)
    cy.get('[class^="conversation--bubble"]').last().should('contain', dateNow)
  }) 

  it('Get message notification', () => {
    cy.visit('/')
    cy.url().should('contain', '/home')
    cy.login()

    const msisdn = '8863'
    const password = btoa('12qwaszx')
    let sellerToken
    let message = Date.now() + ' Testing Message'

    cy.request({
      url: `${IAM_ENDPOINT_URL}/login`,
      method: 'POST',
      body: {
        msisdn,
        password,
      },
    }).its('body').then(body => {
      sellerToken = body.data
      cy.request(
        {
          url: 'https://iam-message-testing.azurewebsites.net/chatql',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + sellerToken,
            'Content-Type': 'application/json'
          },
          body: {
            operationName: 'SendMessage',
            query: `
            mutation SendMessage($id: Int!, $message: String!, $productId: String) {
              pushMessage(text: $message, threadId: $id, productId: $productId) {
                status
                threadId
              }
            }`,
            variables: { id: '44', message }
          }
        }
      )
    })

    cy.wait(3000)
    cy.visit('/chat/44')
    cy.get('[class^="conversation--bubble"]').last().should('contain', message)
  }) 
})

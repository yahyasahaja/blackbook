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
    cy.get('[class^="thread-item"]').eq(0).click()
    const dateNow = 'Test chat on '+new Date().toString()
    cy.get('textarea').type(dateNow)
    cy.get('textarea').siblings('button').click()
    cy.wait(1000)
    cy.get('[class^="conversation--bubble"]').last().should('contain', dateNow)
  })
})

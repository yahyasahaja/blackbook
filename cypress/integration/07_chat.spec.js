describe('Chat page', () => {
  it('Visits the chat page', () => {
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/chat"]').click()
    cy.url().should('include', '/chat')
  })
})

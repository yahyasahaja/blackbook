describe('Favorites Page', () => {
  it('Redirect to login page if not logged in', () => {
    cy.visit('/home')
    cy.url().should('include', '/home')
    cy.get('div[data-testid="product-card"]').eq(0).find('div[data-testid="product-card-action"] > div').as('productCardAction1')
    cy.get('@productCardAction1').eq(0).find('[data-testid="like-button"]').click() // click the buy button
    cy.url().should('include', '/auth/login')
  })
})
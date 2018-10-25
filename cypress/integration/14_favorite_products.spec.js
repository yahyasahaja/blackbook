describe('Favorites Page', () => {
  it('Redirect to login page if not logged in', () => {
    cy.visit('')
    cy.visit('/home')
    cy.url().should('include', '/home')
    cy.get('div[data-testid="product-card"]').eq(0).find('div[data-testid="product-card-action"] > div').as('productCardAction1')
    cy.get('@productCardAction1').eq(0).find('[data-testid="like-button"]').click() // click the buy button
    cy.url().should('include', '/auth/login')
  })

  it('Be able to toggle like button if logged in', () => {
    let color
    cy.visit('/home')
    cy.login()
    cy.get('div[data-testid="product-card"]').eq(0).find('div[data-testid="product-card-action"] > div').as('productCardAction1')
    cy.get('@productCardAction1')
      .eq(0)
      .find('[data-testid="like-button"]')
      .then(dt => color = dt.css('color'))
    cy.get('@productCardAction1').eq(0).find('[data-testid="like-button"]').click()
    cy.url().should('include', '/home')
    cy.wait(2000)
    cy.get('@productCardAction1')
      .eq(0)
      .find('[data-testid="like-button"]')
      .then(dt => {
        let cur = dt.css('color')
        if (cur !== color) {
          expect(cur).to.not.be.equals(color)
        } else expect(cur).to.be.equals(color)
      })
  })
})
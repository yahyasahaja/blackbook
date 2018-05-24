describe('Promo page', () => {
  it('Visits the promo page', () => {
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/promo"]').click()
    cy.url().should('include', '/promo')
  })

  it('Can open promo detail', () => {
    cy.get('[data-testid="promo-card"]').eq(0).then(e => {
      const addr = e.attr('href')
      cy.get('[data-testid="promo-card"]').eq(0).click()
      cy.url().should('include', addr)  
    })
  })

  it('Show promo code', () => {
    cy.get('[data-testid=code-promo]').should(e => {
      const code = e.val()
      expect(code).to.not.be.empty
    })
  })
})

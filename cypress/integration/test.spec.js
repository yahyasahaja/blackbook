describe('Index page', () => {
  it('Visits the home page', () => {
    cy.visit('/')
    cy.url().should('include', '/home')
  })

  it('Open favorite page when click favorite button', () => {
    cy.get('a[href="/favorite"]').click()
    cy.url().should('include', '/favorite')
  })

  it('Open promo page when click promo button', () => {
    cy.get('a[href="/promo"]').click()
    cy.url().should('include', '/promo')
  })

  it('Open chat page when click chat button', () => {
    cy.get('a[href="/chat"]').click()
    cy.url().should('include', '/chat')
  })

  it('Open account page when click account button', () => {
    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')
  })
})

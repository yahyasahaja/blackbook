describe('Login', () => {
  it('Visits the login page', () => {
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')

    cy.get('a[href="/auth/login"]').click()
    cy.url().should('include', '/auth/login')
  })

  it('Set local storage token after login', () => {
    cy.get('.country_code').as('countryCode')
    cy.get('@countryCode').click()
    cy.get('@countryCode').contains('+62').click()
    cy.get('input[name=phone_number]').type('6283333333333')
    cy.get('input[name=password]').type('12qwaszx')
  })
})

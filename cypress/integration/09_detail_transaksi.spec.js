export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

describe('Check Transaction Detail', () => {
  before(() => {
    cy.visit('/')
    cy.login()
  })

  it('Visit login page first', () => {
    localStorage.clear()
    cy.url().should('include', '/home')
    
    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')
    
    cy.get('a[href="/auth/login"]').click()
    cy.url().should('include', '/auth/login')



  })

  it('Login and make it success', () => {
    cy.get('.country_code').click()
    cy.get('.country_code > ul > li').contains('+886').click()
    cy.get('input[name=phone_number]').type('3')
    cy.get('input[name=password]').type('12qwaszx')
    cy.get('[type=submit]').click().should(() => {
      expect(localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)).to.not.be.null
    })
    cy.url().should('include', '/account')
  })

  
})
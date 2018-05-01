export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

describe('Authentication', () => {
  it('Visits the login page', () => {
    cy.visit('/')

    cy.url().should('include', '/home')

    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')

    cy.get('a[href="/auth/login"]').click()
    cy.url().should('include', '/auth/login')
  })

  it('Wrong credentials', () => {
    cy.get('input[name=phone_number]').type('83333333333')
    cy.get('input[name=password]').type('wrongpassword')
    cy.get('[type=submit]').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('Login, Set local storage token and redirect to /account after login', () => {
    cy.reload()
    cy.get('.country_code').click()
    cy.get('.country_code > ul > li').contains('+62').click()
    cy.get('input[name=phone_number]').type('83333333333')
    cy.get('input[name=password]').type('12qwaszx')
    cy.get('[type=submit]').click().should(() => {
      expect(localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)).to.not.be.null
    })
    cy.url().should('include', '/account')
  })

  it('Logout, clear local storage and redirect to /account', () => {
    cy.get('.logout-button').click()
    cy.get('[data-react-toolbox="dialog"] > nav > :nth-child(2)').click().should(() => {
      expect(localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)).to.be.null
    })
    cy.url().should('include', '/account')
  })
})

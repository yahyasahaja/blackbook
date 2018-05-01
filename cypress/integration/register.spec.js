export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

describe('Authentication', () => {
  it('Visits the register page', () => {
    cy.visit('/')

    cy.url().should('include', '/home')

    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')

    cy.get('a[href="/auth/register"]').click()
    cy.url().should('include', '/auth/register')
  })

  it('Register', () => {
    const numbers = '0123456789'
    let phoneNumber = '62'
    for (var i = 0; i < 10; i++)
      phoneNumber += numbers.charAt(Math.floor(Math.random() * numbers.length))

    cy.get('input[name=name]').type('Test User')
    cy.get('.country_code').click()
    cy.get('.country_code > ul > li').contains('+62').click()
    cy.get('input[name=phone_number]').type(phoneNumber)
    cy.get('input[name=password]').type('12qwaszx')
    cy.get('textarea[name=address]').type('Test address')

    cy.stub()
  })

  // TODO: register test

  // it('Wrong credentials', () => {
  //   cy.get('input[name=phone_number]').type('83333333333')
  //   cy.get('input[name=password]').type('wrongpassword')
  //   cy.get('[type=submit]').click()
  //   cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  // })

  // it('Login, Set local storage token and redirect to /account after login', () => {
  //   cy.reload()
  //   cy.get('.country_code').click()
  //   cy.get('.country_code > ul > li').contains('+62').click()
  //   cy.get('input[name=phone_number]').type('83333333333')
  //   cy.get('input[name=password]').type('12qwaszx')
  //   cy.get('[type=submit]').click().should(() => {
  //     expect(localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)).to.not.be.null
  //   })
  //   cy.url().should('include', '/account')
  // })

  // it('Logout, clear local storage and redirect to /account', () => {
  //   cy.get('.logout-button').click()
  //   cy.get('[data-react-toolbox="dialog"] > nav > :nth-child(2)').click().should(() => {
  //     expect(localStorage.getItem(AUTHORIZATION_TOKEN_STORAGE_URI)).to.be.null
  //   })
  //   cy.url().should('include', '/account')
  // })
})

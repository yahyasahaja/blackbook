export const AUTHORIZATION_TOKEN_STORAGE_URI = 'hashAuthToken'

const TEST_PHONE_NUMBER_NOT_EXIST = '46030693630'
const TEST_PHONE_NUMBER_EXIST = '3963968936'
const TEST_VALID_TOKEN = 'VALID-TOKENiioehriuenoinvoiewjioejg'
const TEST_INVALID_OTP_CODE = 'testInvalidOTPCode'
const TEST_VALID_OTP_CODE = 'testValidOTPCode'
const TEST_INVALID_OTP_TOKEN = 'testInvalidOTPToken'
const TEST_VALID_OTP_TOKEN = 'testvalidOTPToken'
const TEST_REGISTER_TOKEN = 'testRegisterToken'
const TEST_USER = {
  name: 'Test Name',
  msisdn: TEST_PHONE_NUMBER_EXIST,
}

describe('Forgot password', () => {
  it('Visits the Forgot Password page', () => {
    localStorage.clear()
    cy.visit('/')

    cy.url().should('include', '/home')

    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')

    cy.get('a[href="/auth/login"]').click()
    cy.url().should('include', '/login')

    cy.get('a[href="/auth/forgot"]').click()
    cy.url().should('include', '/auth/forgot')
  })
  // TODO: register test

  it('Phone number is not exist', () => {
    localStorage.clear()
    cy.visit('/auth/login')
    
    cy.server()
    cy.route(
      'POST',
      'https://iam-message-testing.azurewebsites.net/quick/*',
      {
        is_ok: false,
        msisdn: TEST_PHONE_NUMBER_NOT_EXIST
      }
    )

    cy.get('a[href="/auth/forgot"]').click()
    cy.url().should('include', '/auth/forgot')

    cy.get('input[name=phone_number]').type(TEST_PHONE_NUMBER_NOT_EXIST)
    cy.get('[data-testid="primary-button"]').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('Phone number is exist', () => {
    localStorage.clear()
    cy.visit('/auth/login')

    cy.server()
    cy.route(
      'POST',
      'https://iam-message-testing.azurewebsites.net/quick/*',
      {
        is_ok: true,
        msisdn: TEST_PHONE_NUMBER_EXIST
      }
    )

    cy.route(
      'POST',
      'https://iam-message-testing.azurewebsites.net/otp-sms/*',
      {
        is_ok: true,
        data: TEST_VALID_TOKEN,
      }
    )

    cy.get('a[href="/auth/forgot"]').click()
    cy.url().should('include', '/auth/forgot')

    cy.get('input[name=phone_number]').type(TEST_PHONE_NUMBER_NOT_EXIST)
    cy.get('[data-testid="primary-button"]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
  })

  it('OTP confirmation is not valid', () => {
    cy.server()
    cy.route(
      'POST',
      'https://iam-message-testing.azurewebsites.net/otp-sms/*',
      {
        is_ok: false,
        error: TEST_INVALID_OTP_TOKEN
      }
    )

    cy.wait(1000)

    cy.get('input[name="otp"').type(TEST_INVALID_OTP_CODE)
    cy.get('button').contains('Konfirmasi').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('OTP confirmation is valid', () => {
    cy.server()
    cy.route(
      'POST',
      'https://iam-message-testing.azurewebsites.net/otp-sms/*',
      {
        is_ok: true,
        validToken: TEST_VALID_OTP_TOKEN
      }
    )

    cy.wait(1000)

    cy.get('input[name="otp"').clear()
    cy.get('input[name="otp"').type(TEST_VALID_OTP_CODE)
    cy.get('button').contains('Konfirmasi').click()
    cy.url().should('include', '/auth/forgot/new')
  })

  it('New password and retype should be the same', () => {
    cy.get('input[data-testid="new-password"]').type('not')
    cy.get('input[data-testid="retype-password"]').type('match')
    cy.get('[type="submit"]').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('Change password', () => {
    cy.server()
    cy.route(
      'POST',
      'https://iam-message-testing.azurewebsites.net/forgot/*',
      {
        is_ok: true,
      }
    )

    cy.wait(1000)

    cy.get('input[data-testid="new-password"]').clear().type('isMatch')
    cy.get('input[data-testid="retype-password"]').clear().type('isMatch')
    cy.get('[type="submit"]').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
    cy.url().should('include', '/auth/login')
  })

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

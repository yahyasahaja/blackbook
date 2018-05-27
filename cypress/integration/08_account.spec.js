describe('account', () => {
  it('should visit account page', () => {
    cy.visit('/', {
      onBeforeLoad:(win) => {
        cy.spy(win,'fetch')
      }
    })
    cy.login()
    cy.visit('/account')
    cy.url().should('includes','/account')
  })

  it('change profile name', () => {
    cy.get('.data-cy-profile-account').click()
    cy.get('input[type="text"]').eq(0).clear().type('Test Edit Name')
    cy.get('input[type="text"]').eq(2).clear().type('Test Address')
    cy.get('input[type="text"]').eq(3).clear().type('Test Edit City')
    cy.get('input[type="text"]').eq(4).clear().type('123456')
    cy.get('[type=submit]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('button').contains('Ok').click()
    cy.wait(500)
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('restore data profile', () => {
    cy.wait(1000)
    cy.get('input[type="text"]').eq(0).clear().type('Taiwan Test Buyer 1')
    cy.get('input[type="text"]').eq(2).clear().type('Malang, Jawa Timur')
    cy.get('input[type="text"]').eq(3).clear().type('Malang')
    cy.get('input[type="text"]').eq(4).clear().type('65142')
    cy.get('[type=submit]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('button').contains('Ok').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })
})

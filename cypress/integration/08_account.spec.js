describe('Account Page', () => {
  beforeEach(()=>{
    cy.visit('/account')
    cy.login()
    cy.wait(1000)
    cy.get('[data-react-toolbox="list"] li').as('list-item')
  })
  it('should visit account page', () => {
    cy.url().should('includes','/account')
  })

  it('change profile name', () => {
    cy.get('@list-item').eq(0).click()
    cy.get('input[type="text"]').eq(0).clear().wait(50).type('Test Edit Name')
    cy.get('input[type="text"]').eq(2).clear().wait(50).type('Test Address')
    cy.get('input[type="text"]').eq(3).clear().wait(50).type('Test Edit City')
    cy.get('input[type="text"]').eq(4).clear().wait(50).type('123456')
    cy.get('[type=submit]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('button').contains('Ok').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('restore data profile', () => {
    cy.get('@list-item').eq(0).click()
    cy.get('input[type="text"]').eq(0).clear().wait(50).type('Taiwan Test Buyer 1')
    cy.get('input[type="text"]').eq(2).clear().wait(50).type('Malang, Jawa Timur')
    cy.get('input[type="text"]').eq(3).clear().wait(50).type('Malang')
    cy.get('input[type="text"]').eq(4).clear().wait(50).type('65142')
    cy.get('[type=submit]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('button').contains('Ok').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('Check Processed Transaction', () => {
    cy.get('@list-item').eq(1).click()
    cy.url().should('include','/account/transaction')
    cy.wait(1000)
    cy.get('div[class^="transaction--list"] > div[class^="transaction-list--container"]').should((item) => expect(item).to.have.length(10))
  })

  it('Check Transaction Done', () => {
    cy.get('@list-item').eq(1).click()
    cy.get('button').contains('Selesai').click()
    cy.get('div[class^="transaction--list"] > div[class^="transaction-list--container"]').should((item) => expect(item).to.have.length(2))
  })

  it('Change Password the wrong way', () => {
    cy.get('@list-item').eq(2).click()
    cy.url().should('include','/account/password')
    cy.get('input').eq(0).type('12qwaszx')
    cy.get('input').eq(1).type('12qwaszx')
    cy.get('input').eq(2).type('1234qwer')
    cy.get('button[type="submit"]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('button').contains('Ok').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
    cy.get('button').contains('Cancel').click()
  })

  it('Change password properly', () => {
    cy.get('@list-item').eq(2).click()
    cy.get('input').eq(0).type('12qwaszx')
    cy.get('input').eq(1).clear().type('1234qwer')
    cy.get('input').eq(2).type('1234qwer')
    cy.get('button[type="submit"]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('button').contains('Ok').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('Restore password data', () => {
    cy.get('@list-item').eq(2).click()
    cy.get('input').eq(0).type('1234qwer')
    cy.get('input').eq(1).type('12qwaszx')
    cy.get('input').eq(2).type('12qwaszx')
    cy.get('button[type="submit"]').click()
    cy.get('button').contains('Ok').click()
  })

  it('Berjualan di Blanja', () => {
    cy.get('@list-item').eq(3).click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('[data-react-toolbox="dialog"]').find('button').contains('Okay').click()
    cy.get('[data-react-toolbox="dialog"]').should('not.be.visible')
  })
})

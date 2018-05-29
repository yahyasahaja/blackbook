describe('Account Page', () => {
  before(() => {
    cy.visit('/')
    cy.login()
  })
  beforeEach(()=>{
    cy.get('a[href="/account"]').eq(0).click({force:true})
    cy.get('[data-react-toolbox="list"] li').as('list-item')
  })

  it('change profile name', () => {
    cy.get('@list-item').eq(0).click()
    cy.get('input[type="text"]').eq(0).clear().type('Test Edit Name')
    cy.get('input[type="text"]').eq(2).clear().type('Test Address')
    cy.get('input[type="text"]').eq(3).clear().type('Test Edit City')
    cy.get('input[type="text"]').eq(4).clear().type('123456')
    cy.get('[type=submit]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('button').contains('Ok').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
    cy.get('[data-react-toolbox="snackbar"]').find('button').contains('Dismiss').click()
  })

  it('restore data profile', () => {
    cy.get('@list-item').eq(0).click()
    cy.get('input[type="text"]').eq(0).clear().type('Taiwan Test Buyer 1')
    cy.get('input[type="text"]').eq(2).clear().type('Malang, Jawa Timur')
    cy.get('input[type="text"]').eq(3).clear().type('Malang')
    cy.get('input[type="text"]').eq(4).clear().type('65142')
    cy.get('[type=submit]').click()
    cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    cy.get('button').contains('Ok').click()
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
  })

  it('Check Transaction', () => {
    cy.stub()
    cy.get('@list-item').eq(1).click()
    cy.url().should('include','/account/transaction')
    cy.get('div[class^="transaction--list"] > div[class^="transaction-list--container"]', {timeout:5000}).should((item) => expect(item).to.have.length(10))
    cy.get('button').contains('Selesai').click()
    cy.get('div[class^="transaction--list"] > div[class^="transaction-list--container"]').should((item) => expect(item).to.have.length(10))
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
    cy.get('[data-react-toolbox="snackbar"]').find('button').contains('Dismiss').click()
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

  it('Change avatar img', () => {
    cy.get('@list-item').eq(0).click()
    cy.upload_file('dog2.jpg', 'input[type="file"]')
  })
})

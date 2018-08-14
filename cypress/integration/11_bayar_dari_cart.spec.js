describe('Pay product from Cart', () => {

  it('Will visit login page', () => {
    localStorage.clear()
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')
    
    cy.get('a[href="/auth/login"]').click()
    cy.url().should('include', '/auth/login')
  })

  it('Can buy and pay product', () =>{
    cy.login()
    cy.visit('/')
    cy.url().should('include', '/home')
    cy.get('div[data-testid="product-card"]').eq(0).find('div[data-testid="product-card-action"] > div').as('productCardAction1')
    cy.get('@productCardAction1').eq(1).find('button').click() //click Buy button
    cy.get('@productCardAction1').eq(0).find('button').click() //click Buy after popup appear
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
    cy.get('a[href="/cart"]').eq(1).find('div[data-testid="badge-count"]').contains('1')

    cy.get('a[href="/cart"]').eq(1).click()
    
    cy.url().should('include', '/cart')
    cy.get('div[data-testid="cart-detail"]',  {timeout: 8000}).find('button').contains('LANJUTKAN').click()

  })
  it('Fill Address and Payment Method', () => {
    cy.url().should('include', '/cart/process')
  })

})
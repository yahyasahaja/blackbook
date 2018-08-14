describe('Home', () => {
  it('Can visit home page', () => {
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.visit('/favorite')
    cy.url().should('include', '/favorite')

    cy.get('a[href="/home"]').click()
    cy.url().should('include', '/home')
  })

  it('Match items order', () => {
    cy.visit('/favorite')
    cy.url().should('include', '/favorite')

    cy.server()
    cy.route('POST', 'https://product-hub-testing.azurewebsites.net/graphql').as('productRequest')

    cy.visit('/home', {
      onBeforeLoad: (win) => {
        win.fetch = null
      }
    })

    cy.wait('@productRequest').then(xhr => {
      console.log(1, xhr)
      cy.get('div[data-testid="product-card"]').should('exist', true)
    })

    cy.route('POST', 'https://product-hub-testing.azurewebsites.net/graphql').as('productRequest')
    cy.wait('@productRequest').then(xhr => {
      console.log(1, xhr)
      cy.get('div[data-testid="product-card"]')
    })
  })
})
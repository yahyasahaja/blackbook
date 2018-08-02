describe('Check Transaction Detail', () => {
  it('Visit login page first', () => {
    localStorage.clear()
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')
    
    cy.get('a[href="/auth/login"]').click()
    cy.url().should('include', '/auth/login')
  })

  it('Login and make it success', () => {
    cy.login()
  })

  it('Choose Daftar Transaksi', () => {
    cy.get('.daftar-transaksi').click()
    cy.url().should('include', '/transaction')
    cy.wait(3000)
  })

  it('See transaction detail from Proses Tab', () => {
    cy.get('button[data-cyid="Detail Transaksi"]').eq(0).click()
    cy.wait(2000)
    cy.get('a[href="/account/transaction"').click()
    cy.url().should('include', '/transaction')
  })

  it('See transaction detail from Selesai Tab', () => {
    cy.get('.Selesai').click()
    cy.wait(2000)
    cy.get('button[data-cyid="Detail Transaksi"]').eq(0).click()
    cy.wait(2000)
    cy.get('a[href="/account/transaction"').click()
  })


})
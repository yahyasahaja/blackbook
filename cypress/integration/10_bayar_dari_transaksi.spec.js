describe('Paying product from Transaction List', () => {
  it('Visit login page', () => {
    localStorage.clear()
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')
    
    cy.get('a[href="/auth/login"]').click()
    cy.url().should('include', '/auth/login')
  })

  it('Login with exisiting account', () => {
    cy.login()
  })

  it('Visit Daftar Transaksi Page', () => {
    cy.get('.daftar-transaksi').click()
    cy.url().should('include', '/transaction')
  })

  it('Access Bayar on Proses Tab and Renew it', () => {
    if(cy.get('button[data-cyid="Bayar"]').eq(0)){
      cy.get('button[data-cyid="Bayar"]').eq(0).click()
    }
    // const date = new Date()
    // date.setDate(date.getDate() + 2)
    // cy.clock(date.getTime())
    if(cy.get['button[data-cyid="Renew"']){
      cy.get('button[data-cyid="Renew"]').click()
      cy.get('div[data-cy="pay"]').click()
    } else{
      cy.get('div[data-cy="pay"]').click()
    }
    cy.wait(3000)
  })

  it('Close pembayaran', () => {
    cy.get('div[data-cy="close"]').click()
  })

  it('Back to Daftar Transaksi Page', () => {
    cy.get('a[href="/account/transaction"]').click()
    
  })

  it('Bayar through Detail Transaksi', () => {
    cy.get('button[data-cyid="Detail Transaksi"]').eq(1).click()
    if(cy.get('button[data-cyid="Bayar"]').eq(1)){
      cy.get('button[data-cyid="Bayar"]').eq(1).click({force: true})
    }
    if(cy.get['button[data-cyid="Renew"']){
      cy.get('button[data-cyid="Renew"]').click()
      cy.wait(1000)
      cy.get('div[data-cy="pay"]').click()
    } else{
      cy.get('div[data-cy="pay"]').click()
    }
    cy.wait(3000)
  })
  it('Close pembayaran again', () => {
    cy.get('div[data-cy="close"]').click()
  })

})
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

  it('Login with existing account', () => {
    cy.login()
  })

  it('Visit Daftar Transaksi Page', () => {
    cy.get('.daftar-transaksi').click()
    cy.url().should('include', '/transaction')
  })

  it('Access Bayar on Proses Tab and Renew it', () => {
    if(cy.get('button[data-cyid=Bayar]').eq(0)){
      cy.get('button[data-cyid=Bayar]').eq(0).click()
    }
    
    // const date = new Date()
    // date.setDate(date.getDate() + 2)
    // cy.clock(date.getTime())
    cy.get('div[data-cy=pay]').each(($element, index) => {
      if($element.find('button[data-cyid=Renew]')){
        console.log('renew exist')
        // expect(cy.wrap($element).get('button[data-cyid=Renew]')).to.be.exist
        // cy.wrap($element).get('button[data-cyid=Renew]').click()
        // cy.wrap($element).get('button[data-cy=pay]').click()
        // expect(cy.wrap($element).get('div[data-cy=popup]')).to.be.exist
      } else {
        cy.wrap($element).get('button[data-cy=pay]').click()
        expect(cy.wrap($element).get('div[data-cy=popup]')).to.be.exist
      }
    })
    cy.wait(3000)
  })

  it('Close pembayaran', () => {
    cy.get('div[data-cy=close]').click()
  })

  it('Back to Daftar Transaksi Page', () => {
    cy.get('a[href="/account/transaction"]').click()
    cy.url().should('include', '/transaction')
  })

  it('Bayar through Detail Transaksi', () => {
    cy.get('button[data-cyid="Detail Transaksi"]').eq(1).click()
    if(cy.get('button[data-cyid=Bayar]').eq(1)){
      cy.get('button[data-cyid=Bayar]').eq(1).click({force: true})
    }
    if(cy.get['button[data-cyid=Renew]']){
      cy.get('button[data-cyid=Renew]').click()
      cy.wait(1000)
      cy.get('div[data-cy=pay]').click()
    } else{
      cy.get('div[data-cy=pay]').click()
    }
    cy.wait(3000)
  })
  it('Close pembayaran again', () => {
    cy.get('div[data-cy="close"]').click()
  })

})
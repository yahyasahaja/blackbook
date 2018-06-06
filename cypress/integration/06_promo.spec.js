describe('Promo page', () => {
  it('Visits the promo page', () => {
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/promo"]').click()
    cy.url().should('include', '/promo')
  })

  it('Can open promo detail', () => {
    cy.get('[data-testid="promo-card"]').eq(0).then(e => {
      const addr = e.attr('href')
      cy.get('[data-testid="promo-card"]').eq(0).click()
      cy.url().should('include', addr)  
    })
  })

  it('Show promo code', () => {
    cy.get('[data-testid=code-promo]').should(e => {
      const code = e.val()
      expect(code).to.not.be.empty
    })
  })

  it('Order with wrong promo code', () => {
    cy.clearLocalStorage()

    cy.visit('/')
    cy.get('[class^="product-card"]').eq(0).as('card-wrapper')
    cy.get('@card-wrapper').find('button').contains('BELI').click()
    cy.get('@card-wrapper').find('[data-testid="primary-button"]').click()
    cy.visit('/cart')
    cy.get('[data-react-toolbox="checkbox"] > input[type="checkbox"]').click({force:true})
    cy.get('input[type="text"]').type('promo-promoan')
    cy.get('button').contains('GUNAKAN').click()
    cy.get('p[class*="error"').contains('Silahkan cek kembali kode voucher anda!').should('be.visible')
  })

  it('Order with Promo', () => {
    cy.clearLocalStorage()
    let total, ongkir
    const disc = ['TW10OFF','TW20OFF','TW30OFF','TW40OFF']
    const randDisc = disc[Math.floor(Math.random()*disc.length)]

    cy.visit('/')
    cy.get('[class^="product-card"]').eq(0).as('card-wrapper')
    cy.get('@card-wrapper').find('button').contains('BELI').click()
    cy.get('@card-wrapper').find('[data-testid="primary-button"]').click()
    cy.visit('/cart')
    cy.get('[data-testid="cart-total"]').then(item => {
      total = Number(item.text().replace(/[\D]*/gi,''))
      cy.get('[data-react-toolbox="checkbox"] > input[type="checkbox"]').click({force:true})
      cy.get('input[type="text"]').type(randDisc)
      cy.get('button').contains('GUNAKAN').click()
      cy.wait(3000)
      cy.get('[data-testid="cart-shipping-cost"]').then(el=>{
        ongkir = Number(el.text().replace(/[\D]*/gi,''))
        total = (((total+ongkir)-Number(randDisc.replace(/[\D]*/gi,''))))
        cy.get('[data-testid="discount"]').should('be.visible')
        cy.get('[data-testid="discount"]').should('contain', '- NTD '+randDisc.replace(/[\w]*/gi,''))
        cy.get('[data-testid="cart-total"]').should('contain', 'NTD '+total)
        cy.get('[data-testid="primary-button"]').click()
      })
    })
  })

})

const clear = Cypress.LocalStorage.clear

Cypress.LocalStorage.clear = (keys) => {
  if (keys) {
    return clear.apply(this, arguments)
  }
}

// clear local storage because we want to start fresh
localStorage.clear()

describe('Cart', () => {
  it('Can visit cart page', () => {
    cy.visit('/')
    cy.get('a[href="/cart"]').eq(1).click()
    cy.url().should('include', '/cart')
  })

  it('Show empty cart message', () => {
    cy.get('p[data-testid="cart-message"]').should('be.visible')
  })

  it('Can add item to cart', () => {
    cy.visit('/')
    cy.get('div[data-testid="product-card"]').eq(0).find('div[data-testid="product-card-action"] > div').as('productCardAction1')
    cy.get('@productCardAction1').eq(1).find('button').click() // click the buy button
    cy.get('@productCardAction1').eq(0).find('button').click() // click buy button after detail pop out

    // check badge count
    cy.get('a[href="/cart"]').eq(1).find('div[data-testid="badge-count"]').contains('1')

    cy.get('div[data-testid="product-card"]').eq(1).find('div[data-testid="product-card-action"] > div').as('productCardAction2')
    cy.get('@productCardAction2').eq(1).find('button').click() // click the buy button
    cy.get('@productCardAction2').eq(0).find('select').eq(1).select('3') // change amount
    cy.get('@productCardAction2').eq(0).find('button').click() // click buy button after detail pop out

    // check badge count
    cy.get('a[href="/cart"]').eq(1).find('div[data-testid="badge-count"]').contains('2')

    // select different variant
    cy.get('@productCardAction2').eq(0).find('select').eq(0).then(($select) => {
      const opt = $select.find('option').eq(1)
      $select.val(opt.text())
      return $select
    }).trigger('change')
    cy.get('@productCardAction2').eq(0).find('button').click()
    cy.get('a[href="/cart"]').eq(1).find('div[data-testid="badge-count"]').contains('3')

    // one more item
    cy.get('div[data-testid="product-card"]').eq(2).find('div[data-testid="product-card-action"] > div').as('productCardAction3')
    cy.get('@productCardAction3').eq(1).find('button').click() // click the buy button
    cy.get('@productCardAction3').eq(0).find('button').click().then(() => { // click buy button after detail pop out
      // check localStorage
      const cartData = localStorage.getItem('cart')
      const data = JSON.parse(cartData)
      expect(data).to.have.length(4)
    }) 
  })

  it('Show list of items', () => {
    cy.get('a[href="/cart"]').eq(1).click()
    cy.url().should('include', '/cart')
    cy.get('div[data-testid="cart-list"] > div[data-testid="cart-item"]').should('have.length', 4)
  })

  it('Can remove an item', () => {
    cy.get('span[data-testid="remove-cart-item"]').eq(3).click()
    cy.get('div[data-testid="cart-list"] > div[data-testid="cart-item"]').should('have.length', 3).then(() => {
      const cartData = localStorage.getItem('cart')
      const data = JSON.parse(cartData)
      expect(data).to.have.length(3)
    })
  })

  it('Has correct total price', () => {
    const cartData = localStorage.getItem('cart')
    const data = JSON.parse(cartData)
    const total = data.reduce((prev, val) => {
      return prev + val.amount * val.product.price.value
    }, 0)

    cy.get('[data-testid="cart-total"]').then(el => {
      const totalCart = el.data('total')

      cy.get('[data-testid="cart-shipping-cost"]').then(el => {
        const shippingCost = el.data('shipping-cost')

        // console.log(total, shippingCost)
        const sum = total + Number(shippingCost)
        expect(sum).to.be.equals(Number(totalCart))
      })
    })
  })

  // TODO: coupon test

  // it('Continue order and show login message when not logged in', () => {
  //   cy.get('a[href="/cart"]').eq(1).click()

  // })


})

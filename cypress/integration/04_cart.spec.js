let temp = ''

describe('Cart', () => {
  beforeEach(() => {
    cy.visit('/home')
    cy.url().should('include', '/home')
    localStorage.setItem('cart', temp)
    cy.wait(1000)
    // console.log('INI CART NYA', localStorage.getItem('cart'), '\nTEMP', temp)
  })

  it('Can visit cart page', () => {
    cy.get('a[href="/cart"]').eq(1).click()
    cy.url().should('include', '/cart')
  })

  it('Show empty cart message', () => {
    cy.get('a[href="/cart"]').eq(1).click()
    cy.get('p[data-testid="cart-message"]').should('be.visible')
  })

  it('Can add item to cart', () => {
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
      temp = cartData
      expect(data).to.have.length(4)
    }) 
  })

  it('Show list of items', () => {
    localStorage.setItem('cart', temp)
    // console.log('CART NYA', localStorage.getItem('cart'))
    cy.get('a[href="/cart"]').eq(1).click()
    cy.url().should('include', '/cart')

    cy.wait(1000)
    
    // console.log('CART', localStorage.getItem('cart'), 'TEMP', temp)
    cy.get('div[data-testid="cart-list"] > div[data-testid="cart-item"]').should('have.length', 4)
  })

  it('Can remove an item', () => {
    localStorage.setItem('cart', temp)
    cy.get('a[href="/cart"]').eq(1).click()
    cy.url().should('include', '/cart')

    cy.get('span[data-testid="remove-cart-item"]').eq(3).click()
    cy.get('div[data-testid="cart-list"] > div[data-testid="cart-item"]').should('have.length', 3).then(() => {
      const cartData = localStorage.getItem('cart')
      const data = JSON.parse(cartData)
      expect(data).to.have.length(3)
    })
  })

  it('Has correct total price', () => {
    localStorage.setItem('cart', temp)
    cy.get('a[href="/cart"]').eq(1).click()
    cy.url().should('include', '/cart')

    cy.server()
    cy.route('POST', 'https://ordering-service-testing.azurewebsites.net/graphql').as('orderingRequest')

    cy.visit('/cart', {
      onBeforeLoad: (win) => {
        localStorage.setItem('cart', temp)
        win.fetch = null
      }
    })

    const cartData = localStorage.getItem('cart')
    const data = JSON.parse(cartData)
    const total = data.reduce((prev, val) => {
      return prev + val.amount * val.product.price.value
    }, 0)

    cy.wait('@orderingRequest').then(() => {
      cy.wait(500)
      cy.get('[data-testid=cart-shipping-cost]').then(shippingCostElement => {
        cy.get('[data-testid="cart-total"]').then(totalElement => {
          const totalCart = totalElement.text().replace('.', '').replace(',', '').split(' ')[1]
          const shippingCost = shippingCostElement.text().replace('.', '').split(' ')[1]
          const sum = total + Number(shippingCost)
          console.log('TOTAL CART', totalCart)
          expect(sum).to.be.equals(Number(totalCart))
        })
      })
    })
  })

  it('Refetch shipping cost when item removed', () => {
    cy.visit('/cart', {
      onBeforeLoad: (win) => {
        cy.spy(win, 'fetch')
      }
    })

    cy.get('span[data-testid="remove-cart-item"]').eq(2).click()
    cy.window().its('fetch').should('be.calledWith', 'https://ordering-service-testing.azurewebsites.net/graphql')
  })

  // TODO: coupon test

  // it('Continue order and show login message when not logged in', () => {
  //   cy.get('a[href="/cart"]').eq(1).click()

  // })


})

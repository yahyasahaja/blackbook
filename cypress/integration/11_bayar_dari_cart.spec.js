let tempAddress, tempChannel, tempTotal
let tempNames = [], tempVariants = [], tempAmount = [], tempPrice = []

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

  it('Can buy product and use Coupon', () =>{
    cy.login()
    cy.visit('/')
    cy.url().should('include', '/home')
    cy.get('div[data-testid="product-card"]').eq(0).find('div[data-testid="product-card-action"] > div').as('productCardAction1')
    cy.get('@productCardAction1').eq(1).find('button').click() //click Buy button
    cy.get('@productCardAction1').eq(0).find('button').click() //click Buy after popup appear
    cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
    cy.get('a[href="/cart"]').eq(1).find('div[data-testid="badge-count"]').contains('1')

    //1 more item
    cy.get('div[data-testid="product-card"]').eq(1).find('div[data-testid="product-card-action"] > div').as('productCardAction2')
    cy.get('@productCardAction2').eq(1).find('button').click() // click the buy button
    cy.get('@productCardAction2').eq(0).find('select').eq(1).select('3') // change amount
    cy.get('@productCardAction2').eq(0).find('button').click() // click buy button after detail pop out

    // check badge count
    cy.get('a[href="/cart"]').eq(1).find('div[data-testid="badge-count"]').contains('2')

    //proceed to cart page
    cy.get('a[href="/cart"]').eq(1).click()
    cy.url().should('include', '/cart')
    
    cy.server()
    cy.route('POST', 'https://ordering-service-testing.azurewebsites.net/graphql').as('orderingRequest')

    cy.visit('/cart', {
      onBeforeLoad: (win) => {
        win.fetch = null
      }
    })

    // wait for shipping cost
    cy.wait('@orderingRequest').then(() => {
      // delay for render state
      cy.wait(500)
      cy.get('div[data-react-toolbox=check]').should(($el) => {
        expect($el).to.be.visible
        $el.click()
      })
      cy.get('input[type=text]').should('be.visible')
      cy.get('button').contains('GUNAKAN').should('be.visible')
      cy.get('input[type=text]').type('TW10OFF')
      cy.get('button').contains('GUNAKAN').click()
    })

    cy.wait(2000)
    cy.wait('@orderingRequest').then(() => {
      cy.get('[data-testid="cart-total"]').then(value => {
        tempTotal = value.text()
        console.log(tempTotal)
        console.log(value.text())
      })
    })

    /*store each product name, amount, variant and price to arrays*/
    cy.get('[data-testid=cart-item]').each(($element, idx) => {
      cy.wrap($element).find('[data-cyid=name]').then( text => {
        tempNames[idx] = text.text()
        console.log(idx)
        console.log(tempNames[idx])
      })
      cy.wrap($element).find('[data-cyid=variant]').then(text => {
        tempVariants[idx] = text.text()
        console.log(idx)
        console.log(tempVariants[idx])
      })
      cy.wrap($element).find('[data-cyid=amount]').then(text => {
        tempAmount[idx] = text.text()
        console.log(idx)
        console.log(tempAmount[idx])
      })
      cy.wrap($element).find('[data-cyid=price]').then(text => {
        tempPrice[idx] = text.text()
        console.log(idx)
        console.log(tempPrice[idx])
      })
    })
    

  })
  
  it('Can fill Address and Payment Method', () => {
    cy.get('div[data-testid="cart-detail"]',  {timeout: 8000}).find('button').contains('LANJUTKAN').click()
    cy.url().should('include', '/cart/process')
    cy.get('.address-dropdown').click()
    cy.get('.address-dropdown > ul > li').eq(1).as('firstAddress')

    cy.get('@firstAddress').click().then(e => {
      cy.get('.address-dropdown > div > input').should('have.value', e.text())
      cy.get('[data-testid="address-detail"]').as('addressDetail')
      cy.get('@addressDetail').then(e => tempAddress = e.html())
      cy.get('@addressDetail').should('be.visible')
    })
  })

  it('Can select channel', () => {
    cy.get('.channel-dropdown').click()
    cy.get('.channel-dropdown > ul > li').eq(1).as('firstChannel')

    cy.get('@firstChannel').click().then(() => {
      cy.get('img[data-testid="channel-logo"]').as('channelLogo')
      cy.get('@channelLogo').then(el => tempChannel = el.data('channel'))
      cy.get('@channelLogo').should('be.visible')
    })
    cy.get('button[data-cyid=PESAN]').should('be.visible')
    cy.get('button[data-cyid=PESAN]').click()
  })
  
  it('Can show Payment Confirmation', () => {
    /*make sure the address, channel logo and total price is with detail payment*/
    cy.get('p[data-testid=address-detail]').should('have.html', tempAddress)
    cy.get('img[data-testid="channel-logo"').then(e => {
      expect(e.data('channel')).to.equal(tempChannel)
    })
    cy.get('span[data-testid=confirmation-total]').then( el => {
      expect(el).to.have.text(tempTotal)
    })

    /*make sure the product data is same on confirmation and cart*/
    cy.get('[data-cyid=confirmation-item]').each(($element, idx) => {
      cy.wrap($element).find('[data-cyid=confirmation-name]').then( text => {
        expect(text.text()).to.be.equal(tempNames[idx])
      })
      cy.wrap($element).find('[data-cyid=confirmation-variant]').then( text => {
        expect(text.text()).to.be.equal(tempVariants[idx])
      })
      cy.wrap($element).find('[data-cyid=confirmation-amount]').then( text => {
        expect(text.text()).to.be.equal(tempAmount[idx])
      })
      cy.wrap($element).find('[data-cyid=confirmation-price]').then( text => {
        expect(text.text()).to.be.equal(tempPrice[idx])
      })
    })

    cy.server()
    cy.route('POST', 'https://ordering-service-testing.azurewebsites.net/graphql').as('orderingRequest')

    cy.get('button[data-cyid=KONFIRMASI]').click()
    cy.wait('@orderingRequest').then(() => {
      cy.get('[data-react-toolbox="snackbar"]').should('be.visible')
    })
    cy.wait(3000)
    cy.get('button[data-cyid=Bayar]').eq(0).click({force: true})
    cy.get('div[data-cy=pay]').each(($element) => {
      cy.wrap($element).get('div[data-cy=payment-status]').should($text => {
        expect($text).to.contain('BELUM LUNAS')
      })
      cy.wait(1000)
      cy.wrap($element).click().then(() => {
        cy.wrap($element).get('div[data-cy=popup]').should('be.visible')
      })
      cy.get('div[data-cy=close]').click()            
    })
  })

})
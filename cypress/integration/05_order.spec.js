let temp, tempAddress, tempInformation, tempChannel, tempTotal

describe('Order', () => {
  before(() => {
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
      temp = cartData
      expect(data).to.have.length(4)
    }) 
  })

  beforeEach(() => {
    localStorage.setItem('cart', temp)
  })

  it('Cannot order if not logged in (show dialog box)', () => {
    cy.visit('/')
    cy.get('a[href="/cart"]').eq(1).click()

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
      cy.get('[data-testid="cart-total"]').then(e => tempTotal = e.text())
      cy.get('[data-testid="cart-detail"] > button[data-testid="primary-button"]').click()
      // should show dialog box
      cy.get('[data-react-toolbox="dialog"]').should('be.visible')
    })
  })

  it('Continue to order page', () => {
    cy.login()
    cy.wait(1000)
    cy.get('[data-testid="cart-detail"] > button[data-testid="primary-button"]').click()
    cy.url().should('include', '/cart/process')
  })

  /**
   * Flow with current address
   */
  it.skip('Test order with default address')

  it('Can select first address', () => {
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
  })

  it('Can continue with same address, channel, and total', () => {
    cy.get('[data-testid="primary-button"]').click()
    cy.url().should('include', '/cart/confirm')
    console.log(tempAddress, tempChannel)

    cy.get('p[data-testid="address-detail"]').should('have.html', tempAddress)

    cy.get('[data-testid="channel-logo"').then(e => {
      expect(e.data('channel')).to.equal(tempChannel)
    })

    cy.get('span[data-testid="confirmation-total"]').should('have.text', tempTotal)
  })

  /**
   * Flow with new address
   */
  it.skip('Test order with new address')

  it('Can choose and write new address', () => {
    cy.login()

    cy.server()
    cy.route('POST', 'https://ordering-service-testing.azurewebsites.net/graphql').as('orderingRequest')

    cy.visit('/cart', {
      onBeforeLoad: (win) => {
        win.fetch = null
      }
    })

    cy.wait('@orderingRequest').then(() => {
      // delay for render state
      cy.wait(500)
      cy.get('[data-testid="cart-total"]').then(e => tempTotal = e.text())
      cy.get('[data-testid="cart-detail"] > button[data-testid="primary-button"]').click()
    })

    cy.url().should('include', '/cart/process')

    cy.get('.address-dropdown').click()
    cy.get('.address-dropdown > ul > li').eq(-2).click()

    cy.get('[name="new-address"').type('New Address Test')
    cy.get('[name="new-city"').type('City Test')
    cy.get('[name="new-zipcode"').type('12345')
    cy.get('.new-save-checkbox').click()
    cy.get('.new-save-checkbox').click() // disable again
    tempAddress = 'New Address Test<br>City Test<br>TWN 12345'
  })

  it('Can select channel', () => {
    cy.get('.channel-dropdown').click()
    cy.get('.channel-dropdown > ul > li').eq(1).as('firstChannel')

    cy.get('@firstChannel').click().then(() => {
      cy.get('img[data-testid="channel-logo"]').as('channelLogo')
      cy.get('@channelLogo').then(el => tempChannel = el.data('channel'))
      cy.get('@channelLogo').should('be.visible')
    })
  })

  it('Can continue with same address, channel, and total', () => {
    cy.get('[data-testid="primary-button"]').click()
    cy.url().should('include', '/cart/confirm')

    cy.get('p[data-testid="address-detail"]').should('have.html', tempAddress)

    cy.get('[data-testid="channel-logo"').then(e => {
      expect(e.data('channel')).to.equal(tempChannel)
    })

    cy.get('span[data-testid="confirmation-total"]').should('have.text', tempTotal)
  })

  /**
   * Flow with image
   */
  it.skip('Test order with image')

  it('Can choose and write new address', () => {
    cy.login()

    cy.server()
    cy.route('POST', 'https://ordering-service-testing.azurewebsites.net/graphql').as('orderingRequest')

    cy.visit('/cart', {
      onBeforeLoad: (win) => {
        win.fetch = null
      }
    })

    cy.wait('@orderingRequest').then(() => {
      // delay for render state
      cy.wait(500)
      cy.get('[data-testid="cart-total"]').then(e => tempTotal = e.text())
      cy.get('[data-testid="cart-detail"] > button[data-testid="primary-button"]').click()
    })

    cy.url().should('include', '/cart/process')

    cy.get('.address-dropdown').click()
    cy.get('.address-dropdown > ul > li').eq(-1).click()

    cy.get('[name="information"').type('Lantai 10 no 12')
    tempInformation = 'Lantai 10 no 12'
    cy.upload_file('addr.png', '[name="address-file"]')
  })

  it('Can select channel', () => {
    cy.get('.channel-dropdown').click()
    cy.get('.channel-dropdown > ul > li').eq(1).as('firstChannel')

    cy.get('@firstChannel').click().then(() => {
      cy.get('img[data-testid="channel-logo"]').as('channelLogo')
      cy.get('@channelLogo').then(el => tempChannel = el.data('channel'))
      cy.get('@channelLogo').should('be.visible')
    })
  })

  it('Can continue with picture, channel, and total', () => {
    cy.get('[data-testid="primary-button"]').click()
    cy.url().should('include', '/cart/confirm')

    cy.get('[data-testid="address-image"]').should('be.visible')
    cy.get('[data-testid="address-information"]').should('have.html', tempInformation)

    cy.get('[data-testid="channel-logo"').then(e => {
      expect(e.data('channel')).to.equal(tempChannel)
    })

    cy.get('span[data-testid="confirmation-total"]').should('have.text', tempTotal)
  })
})

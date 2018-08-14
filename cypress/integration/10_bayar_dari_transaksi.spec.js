import gql from 'graphql-tag'

function pay() {
  cy.server()
  cy.request({
    method: 'POST',
    url: 'https://ordering-service-testing.azurewebsites.net/graphql',
    body:{
      query: gql`
      query order($orderId: ID!){
        order(orderId: $orderId){
          id
          payments{
            id
            expDate
            status
          }
        }
      }
      `,
      variables:{
        orderId: 'IVAA00000000001'
      }
    },
    headers:{
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTAzYTViMDQtMzQ1Yi00MDE1LTkxMTQtODc0YmM2ZTNmZTY5IiwibXNpc2RuIjoiODg2MyIsImlhdCI6MTUzMDU4NjI0MSwiZXhwIjoxNTQwOTU0MjQxfQ.or-ZI-yQU_J5h328MvRFns7LSlwIpW72Rv9OkD1oOgI'
    }
  }).then(response =>{
    console.log(response)
    let arrayPayments = response.body.data.order.payments
    let expDate = []
    let date = []
    for(let i in arrayPayments){
      expDate[i] = response.body.data.order.payments[i].expDate
      console.log(`expDate ke ${i}`, expDate[i])
    }
    for(let i in arrayPayments){
      date[i] = new Date(expDate[i])
      console.log(`date ke ${i}`, date[i])
    }
    for(let i in arrayPayments){
      //check if the product has expired
      if(Date.now() > date[i].getTime()){
        console.log('expired')
        cy.get('div[data-cy=pay]').each(($element) => {
          console.log('renew exist')
          cy.wrap($element).get('button[data-cyid=Renew]').should('be.visible')
          cy.wrap($element).get('button[data-cyid=Renew]').click()
          cy.wrap($element).get('div[data-cy=payment-status]').should($text => {
            expect($text).to.contain('BELUM LUNAS')
          })
          cy.wrap($element).click({force: true}).then(() => {
            cy.wrap($element).get('div[data-cy=popup]').should('be.visible')
          })
          cy.get('div[data-cy=close]').click()
        })
      } else {
        console.log('not expired yet')
        cy.get('div[data-cy=pay]').each(($element) => {
          cy.wrap($element).get('div[data-cy=payment-status]').should($text => {
            expect($text).to.contain('BELUM LUNAS')
          })
          cy.wrap($element).click({force: true}).then(() => {
            cy.wrap($element).get('div[data-cy=popup]').should('be.visible')
          })
          cy.get('div[data-cy=close]').click()            
        })
      }
    }
    cy.wait(3000)
  })
  
}


describe('Paying product from Transaction List', () => {
  it('Can visit login page', () => {
    localStorage.clear()
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/account"]').click()
    cy.url().should('include', '/account')
    
    cy.get('a[href="/auth/login"]').click()
    cy.url().should('include', '/auth/login')
  })

  it('Can login with existing account', () => {
    cy.login()
  })

  it('Can visit Daftar Transaksi Page', () => {
    cy.get('a[href="/account"]').click()
    cy.get('.daftar-transaksi').click()
    cy.url().should('include', '/transaction')
  })

  it('Can Pay on Proses Tab and Renew it if has expired', () => {
    if(cy.get('button[data-cyid=Bayar]').eq(0)){
      cy.get('button[data-cyid=Bayar]').eq(0).click()
    }
    pay()
    
    // const date = new Date()
    // date.setDate(date.getDate() + 2)
    // cy.clock(date.getTime())
    
    
  })

  // it('Can close pembayaran', () => {
  //   cy.get('div[data-cy=close]').click()
  // })

  it('Can back to Daftar Transaksi Page', () => {
    cy.get('a[href="/account/transaction"]').click()
    cy.url().should('include', '/transaction')
  })

  it('Can pay through Detail Transaksi', () => {
    cy.get('button[data-cyid="Detail Transaksi"]').eq(0).click()
    if(cy.get('button[data-cyid=Bayar]').eq(0)){
      cy.get('button[data-cyid=Bayar]').eq(0).click({force: true})
    }
    pay()
  })

  it('Can back to Daftar Transaksi Page again', () => {
    cy.get('a[href="/account/transaction"]').click()
    cy.url().should('include', '/transaction')
  })
})
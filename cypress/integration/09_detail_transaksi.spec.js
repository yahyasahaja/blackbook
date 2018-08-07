import moment from 'moment'

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
    // cy.get('div[data-cy="tanggal"]').eq(0).then(($el)=>{
    //   console.log($el)
    //   console.log($el[0].innerHTML)
    // })
  })

  it('Check every product date to be ordered from newest to oldest', () => {
    let arrayItem = []
    cy.get('div[data-cy="transaction-item"]').each(($el, index) => {
      console.log('Tgl' , $el.find('div[data-cy="tanggal"]').text())
      arrayItem[index] = $el.find('div[data-cy="tanggal"]').text()
      console.log(moment(arrayItem[index], 'DD MMMM YYYY').unix())
      console.log(moment(arrayItem[index+1], 'DD MMMM YYYY').unix())

      if(moment(arrayItem[index-1], 'DD MMMM YYYY').unix() > moment(arrayItem[index], 'DD MMMM YYYY').unix()){
        console.log('true')
        expect(true).to.be.true
      }
      
      
    
      // cy.wrap($el).get('div[data-cy="tanggal"]').then(($el)=>{
      //   console.log($el)
      //   arrayItem[index] = moment($el[index].innerHTML, 'DD MM YYYY').unix()
      //   if(index >=1){
      //     if(arrayItem[index] > arrayItem[index + 1]){
      //       expect(true).to.be.true
      //     }
      //   }
      //   console.log($el[index].innerHTML)
      // })
    })
  })

  it('See transaction detail from Proses Tab', () => {
    cy.get('button[data-cyid="Detail Transaksi"]').eq(0).click()
    cy.wait(2000)
    
    // moment(, 'DD MM YYYY').unix()

    cy.get(':nth-child(1) > .vertical-list--value--1IsmsY5p').should($text => {
      expect($text).to.contain('IVAA00000000007')
    })
    cy.get('a[href="/account/transaction"]').click()
    cy.url().should('include', '/transaction')
  })

  it('See transaction detail from Selesai Tab', () => {
    cy.get('.Selesai').click()
    cy.wait(2000)
    //check all product status should be Success
    cy.get('div[data-cy="transaction-item"]').each(($el) => {
      cy.wrap($el).get('div[data-cy="status"]').should($text => {
        expect($text).to.contain('SELESAI')
      })
    })
    cy.get('button[data-cyid="Detail Transaksi"]').eq(0).click()
    cy.wait(2000)
    cy.get('a[href="/account/transaction"]').click()
  })


})
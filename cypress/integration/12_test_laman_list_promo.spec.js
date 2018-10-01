import moment from 'moment'

let responsePromo = [], promoBeginTime = [], promoEndTime = []

describe('Promo', () => {
  
  it('Can see promo list', () => {
    localStorage.clear()
    cy.visit('/')
    cy.url().should('include', '/home')

    cy.get('a[href="/promo"]').click()
    cy.url().should('include', '/promo')
  })

  it('Can check promo list is same with db', () => {
    cy.scrollTo('0%', '100%', { duration: 3000 })
    cy.request({
      method: 'POST',
      url: 'https://product-hub-testing.azurewebsites.net/graphql',
      body:{
        query: `
        query activePromotions($limit: Int, $offset: Int){
          activePromotions(limit: $limit, offset: $offset){
            promotions{
              title
              image
              begin
              end
            }
            totalCount
          }
        }
        `,
        variables:{
          limit: 10,
          offset: 0
        }
      },
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTAzYTViMDQtMzQ1Yi00MDE1LTkxMTQtODc0YmM2ZTNmZTY5IiwibXNpc2RuIjoiODg2MyIsImlhdCI6MTUzMDU4NjI0MSwiZXhwIjoxNTQwOTU0MjQxfQ.or-ZI-yQU_J5h328MvRFns7LSlwIpW72Rv9OkD1oOgI'
      }
    }).then(response => {
      console.log(response)

      responsePromo = response.body.data.activePromotions.promotions
      cy.get('a[data-testid=promo-card]').each(($element, idx) => {
        /*Make sure all promo title are same with DB*/
        cy.wrap($element).find('span[data-cyid=promo-title]').should(text => {
          expect(text.text()).to.be.equal(responsePromo[idx].title)
        })

        /*Make sure all promo begin time are same with DB*/
        cy.wrap($element).find('span[data-cyid=promo-time]').should(text => {
          console.log(text.text().split(' - '))
          // console.log(text.text().split(' - ')[0])
          promoBeginTime[idx] = text.text().split(' - ')[0]
          console.log(promoBeginTime[idx])
          expect(promoBeginTime[idx]).to.be.equal(moment(responsePromo[idx].begin).format('DD MMM YY'))
        })

        /*Make sure all promo end time are same with DB*/
        cy.wrap($element).find('span[data-cyid=promo-time]').should(text => {
          console.log(text.text().split(' - '))
          // console.log(text.text().split(' - ')[0])
          promoEndTime[idx] = text.text().split(' - ')[1]
          console.log(promoEndTime[idx])
          expect(promoEndTime[idx]).to.be.equal(moment(responsePromo[idx].end).format('DD MMM YY'))
        })

        /*Make sure all promo image are same with DB*/
        cy.wrap($element).get('[data-cyid=promo-image]').find('img').should(img => {
          console.log(img)
          console.log(img[1].currentSrc)
          expect(img[idx]).to.have.attr('src', responsePromo[idx].image)
        })
        
      })
    })
  })
})
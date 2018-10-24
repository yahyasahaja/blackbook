let products = []

describe('Sorting at Product Fetching', () => {
  it('Assert Products', () => {
    cy.visit('/search')
    
    cy.request({
      method: 'POST',
      url: 'https://product-hub-testing.azurewebsites.net/graphql',
      body: {
        query: `
        query allProducts($limit: Int, $offset: Int, $category: String, $sort: String, $order: PaginationOrderEnum, $search: String) {
          allProducts(limit: $limit, offset: $offset, category: $category, sort: $sort, order: $order, search: $search) {
            products {
              id
              name
              variants {
                name
              }
              price {
                value
                currency
              }
              images {
                url
              }
              shareUrl
              liked
              favorited
              created
              sold
              seller {
                id
              }
            }
            totalCount
          }
        }
        `,
        variables: {
          limit: 100,
          offset: 0
        }
      },
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZTAzYTViMDQtMzQ1Yi00MDE1LTkxMTQtODc0YmM2ZTNmZTY5IiwibXNpc2RuIjoiODg2MyIsImlhdCI6MTUzMDU4NjI0MSwiZXhwIjoxNTQwOTU0MjQxfQ.or-ZI-yQU_J5h328MvRFns7LSlwIpW72Rv9OkD1oOgI'
      }
    }).then(data => {
      products = data.body.data.allProducts.products
    })
  })

  it('Sorting by cheapest', () => {
    let res = products.sort((a, b) => a.price.value - b.price.value)
    cy.visit('/search')
    cy.wait(2000)
    cy.get('[data-testid="filter"]').select('termurah')
    cy.wait(1000) //.contains(res[0].name)
    cy.get('[data-testid="product-card-name"]').each((el, i) => {
      expect(el.html()).to.be.equals(res[i].name)
    })
  })

  it('Sorting by most expensive', () => {
    let res = products.sort((a, b) => -a.price.value + b.price.value)
    cy.visit('/search')
    cy.wait(2000)
    cy.get('[data-testid="filter"]').select('termahal')
    cy.wait(1000) //.contains(res[0].name)
    cy.get('[data-testid="product-card-name"]').each((el, i) => {
      expect(el.html()).to.be.equals(res[i].name)
    })
  })

  it('Sorting by oldest', () => {
    console.log(products)
    let res = products.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    cy.visit('/search')
    cy.wait(2000)
    cy.get('[data-testid="filter"]').select('terlama')
    cy.wait(1000) //.contains(res[0].name)
    cy.get('[data-testid="product-card-name"]').each((el, i) => {
      expect(el.html()).to.be.equals(res[i].name)
    })
  })

  it('Sorting by newest', () => {
    console.log(products)
    let res = products.sort((a, b) => -new Date(a.created).getTime() + new Date(b.created).getTime())
    cy.visit('/search')
    cy.wait(2000)
    cy.get('[data-testid="filter"]').select('terbaru')
    cy.wait(1000) //.contains(res[0].name)
    cy.get('[data-testid="product-card-name"]').each((el, i) => {
      expect(el.html()).to.be.equals(res[i].name)
    })
  })
})
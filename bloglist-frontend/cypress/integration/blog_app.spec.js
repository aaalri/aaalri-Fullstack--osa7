describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi Testaaja',
      username: 'testi',
      password: 'hahehihohu'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    const user2 = {
      name: 'Tisti Testaaja',
      username: 'tisti',
      password: 'hahehohu'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('hahehihohu')
      cy.get('#login-button').click()

      cy.contains('Testi Testaaja logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').contains('wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Testi Testaaja logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const user = {
        username: 'testi',
        password: 'hahehihohu'
      }
      cy.login(user)
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('authorcypress')
      cy.get('#url').type('cypress.url')
      cy.get('#create-blog').click()
      cy.contains('a blog created by cypress')
    })

    describe('And one blog exists', function() {
      beforeEach(function() {
        const blog = {
          title: 'a blog created by cypress',
          author: 'authorcypress',
          url: 'cypress.url',
        }
        cy.createBlog(blog)
      })

      it('it can be liked', function () {
        cy.contains('a blog created by cypress').parent().parent().as('theBlog')
        cy.get('@theBlog').contains('show').click()
        cy.get('@theBlog').contains('likes 0')
        cy.get('@theBlog').find('#like-button').click()
        cy.get('@theBlog').contains('likes 1')
      })

    })
    describe('And many blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'a first blog created by cypress', author: 'authorcypress', url: 'cypress.url' })
        cy.createBlog({ title: 'a second blog created by cypress', author: 'authorcypress', url: 'cypresslazy.url' })
        cy.createBlog({ title: 'a third blog created by cypress', author: 'authorcypressthegreat', url: 'cypressbest.url' })
      })

      it('one of those can be liked', function () {
        cy.contains('a second blog created by cypress').parent().parent().as('theBlog')
        cy.get('@theBlog').contains('show').click()
        cy.get('@theBlog').contains('likes 0')
        cy.get('@theBlog').find('#like-button').click()
        cy.get('@theBlog').contains('likes 1')
      })

      it('one of those can be removed', function () {
        cy.contains('cypressbest.url')
        cy.contains('a third blog created by cypress').parent().parent().as('theBlog')
        cy.get('@theBlog').contains('show').click()
        cy.get('@theBlog').find('#delete-button').click()
        cy.contains('cypressbest.url').should('not.exist')
      })

      describe('When logged in as other', function() {
        beforeEach(function() {
          const user = {
            username: 'tisti',
            password: 'hahehohu'
          }
          cy.login(user)
        })
        it('one of those can\'t be removed', function () {
          cy.contains('cypressbest.url')
          cy.contains('a third blog created by cypress').parent().parent().as('theBlog')
          cy.get('@theBlog').contains('show').click()
          cy.get('@theBlog').find('#delete-button').should('not.exist')
        })
      })

      describe('And they are liked', function() {
        beforeEach(function() {
          cy.contains('a first blog created by cypress').parent().parent().as('theBlog1')
          cy.contains('a second blog created by cypress').parent().parent().as('theBlog2')
          cy.contains('a third blog created by cypress').parent().parent().as('theBlog3')
          cy.get('@theBlog1').contains('show').click()
          cy.get('@theBlog2').contains('show').click()
          cy.get('@theBlog3').contains('show').click()
          //cy.intercept('GET','/api/blogs').as('getBlogs')
          for(let n = 0; n < 6; n ++){
            cy.get('@theBlog2').find('#like-button').click()
            //cy.wait('@getBlogs')
            cy.get('@theBlog2').contains(`likes ${n+1}`)
          }
          for(let n = 0; n < 2; n ++){
            cy.get('@theBlog1').find('#like-button').click()
            //cy.wait('@getBlogs')
            cy.get('@theBlog1').contains(`likes ${n+1}`)
          }
          for(let n = 0; n < 9; n ++){
            cy.get('@theBlog3').find('#like-button').click()
            //cy.wait('@getBlogs')
            cy.get('@theBlog3').contains(`likes ${n+1}`)
          }
          for(let n = 0; n < 5; n ++){
            cy.get('@theBlog1').find('#like-button').click()
            //cy.wait('@getBlogs')
            cy.get('@theBlog1').contains(`likes ${n+3}`)
          }
        })

        it('they are ordered correctly', function () {
          let order = ['likes 6', 'likes 7', 'likes 9']
          cy.get('.like').each((like) => {
            cy.wrap(like).contains(order.pop())
          })
        })
      })
    })
  })
})
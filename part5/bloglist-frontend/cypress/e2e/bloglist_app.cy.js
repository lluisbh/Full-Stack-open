describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: 'test',
      name: 'test user',
      password: 'test1234'
    }
    const user2 = {
      username: 'testalt',
      name: 'test user alt',
      password: '4321tset'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('test1234')
      cy.contains('login').click()
      cy.contains('test user logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('test12345')
      cy.contains('login').click()
      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'test',
        password: 'test1234'
      })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.contains('title:').find('input').type('test blog')
      cy.contains('author:').find('input').type('test author')
      cy.contains('url:').find('input').type('test url')
      cy.contains('button', 'create').click()

      cy.get('.confirm')
        .should('contain', 'a new blog "test blog" was added')
      cy.contains('test blog test author')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createNote({
          title: 'Test Blog 1',
          author: 'John Doe',
          url: 'test.com',
          likes: 10,
        })
        cy.contains('Test Blog 1 John Doe')
        cy.login({
          username: 'testalt',
          password: '4321tset'
        })
        cy.contains('test user alt logged in')
        cy.createNote({
          title: 'Test Blog 2',
          author: 'Michael',
          url: 'test.com',
          likes: 5,
        })
        cy.contains('Test Blog 2 Michael')
        cy.createNote({
          title: 'Test Blog 3',
          author: 'Lluis',
          url: 'test.com',
          likes: 1,
        })
        cy.contains('Test Blog 3 Lluis')
        cy.login({
          username: 'test',
          password: 'test1234'
        })
        cy.contains('test user logged in')
      })

      it('a blog can be liked', function () {
        cy.contains('Test Blog 1 John Doe').as('blogEntry')
        cy.get('@blogEntry').contains('view').click()
        cy.get('@blogEntry').contains('like').click()
        cy.get('@blogEntry').contains('11')
      })

      it('a blog can be removed by its author', function () {
        cy.contains('Test Blog 1 John Doe').as('blogEntry')
        cy.get('@blogEntry').contains('view').click()
        cy.get('@blogEntry').contains('remove').click()
        cy.get('@blogEntry').should('not.exist')
        cy.get('.confirm')
          .should('contain', 'Blog "Test Blog 1" removed')
      })

      it('a blog cannot be removed by other users', function () {
        cy.contains('Test Blog 2 Michael').as('blogEntry')
        cy.get('@blogEntry').contains('view').click()
        cy.get('@blogEntry').contains('remove').should('have.css', 'display', 'none')
      })

      it('blogs are ordered by likes', function () {
        cy.get('.blog').eq(0).contains('Test Blog 1 John Doe')
        cy.get('.blog').eq(1).contains('Test Blog 2 Michael')
        cy.get('.blog').eq(2).contains('Test Blog 3 Lluis')

        cy.contains('Test Blog 3 Lluis').as('blogEntry')
        cy.get('@blogEntry').contains('view').click()

        for (let i = 1; i < 6; i++) {
          cy.get('@blogEntry').contains('like').click()
          cy.get('@blogEntry').contains(String(i+1))
        }

        cy.get('.blog').eq(0).contains('Test Blog 1 John Doe')
        cy.get('.blog').eq(1).contains('Test Blog 3 Lluis')
        cy.get('.blog').eq(2).contains('Test Blog 2 Michael')
      })
    })
  })
})
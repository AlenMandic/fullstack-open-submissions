/* eslint-disable */
describe('Blog posting app', () => {

  beforeEach(function() {
    cy.visit('http://localhost:5173/')
 })

  it('Front page is rendered and contains a blog', function()  {
    cy.contains('Random Blog 1')
  })

  it('Login form can be opened and then closed', function() {
    cy.contains('Log in').click()
    cy.contains('Cancel').click()
  })
  // needs to be completed
  it('User can login successfully', function() {
    cy.contains('Log in').click()
    cy.get('#username-input').type('testingusername1') // an element with an id of username
    cy.get('#password-input').type('testingpassword1')
    cy.contains('Login').click()

    cy.contains('testingname1 is logged in')
  })

  it.only('Login fails with the wrong password provided', function() {
    cy.contains('Log in').click()
    cy.get('#username-input').type('testingusername1')
    cy.get('#password-input').type('wrongpassword')
    cy.contains('Login').click()

    cy.contains('Login failed. Check login details: ')
    cy.get('html').should('not.contain', 'testingname1 is logged in')
  })
})
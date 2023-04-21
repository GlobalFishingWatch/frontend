describe('Login', function () {
  beforeEach(function () {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPassword'))
    cy.visit('/')
  })

  it('shows user info', function () {
    cy.contains('JA').should('be.visible')
  })
})

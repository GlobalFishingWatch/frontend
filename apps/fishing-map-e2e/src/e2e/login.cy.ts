describe('Login', function () {
  beforeEach(function () {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
    cy.visit('/')
  })

  it('shows user info', function () {
    cy.contains(Cypress.env('apiUserInitials')).should('be.visible')
  })
})

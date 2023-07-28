describe('Login', function () {
  beforeEach(function () {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
  })

  it('shows user info', function () {
    cy.get('a[href*="/user"]').contains(Cypress.env('apiUserInitials')).should('be.visible')
  })
})

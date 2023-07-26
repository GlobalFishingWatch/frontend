import { afterTestSkip, beforeTestSkip } from '../support/app.po'

describe('Login', function () {
  beforeEach(function () {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
  })
  before(() => beforeTestSkip())
  afterEach(afterTestSkip)

  it('shows user info', function () {
    cy.get('a[href*="/user"]').contains(Cypress.env('apiUserInitials')).should('be.visible')
  })
})

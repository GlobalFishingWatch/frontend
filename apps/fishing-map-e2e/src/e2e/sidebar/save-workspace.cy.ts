import {
  disablePopups,
  getWorkspace,
  switchLanguage,
  waitForMapLoadTiles,
  waitForSidebarLoaded,
} from '../../support/app.po'
import { WORKSPACE_NAME } from '../../constants/workspace'

describe('Save a workspace', () => {
  before(() => {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
  })
  beforeEach(() => {
    disablePopups()
    cy.visit('/')
    waitForSidebarLoaded()
    waitForMapLoadTiles()
  })

  it('Should create and delete a workspace', () => {
    switchLanguage('en')
    cy.getBySel('save-workspace-button').click()
    cy.getBySel('create-workspace-input').clear()
    cy.getBySel('create-workspace-input').type(WORKSPACE_NAME)
    cy.getBySel('create-workspace-button').click()
    getWorkspace().should('contain', WORKSPACE_NAME)
    cy.get('a[href*="/user"]').contains(Cypress.env('apiUserInitials')).click()
    cy.getBySel('user-workspace').click()
    cy.get('a[href*="/fishing-activity"]').contains(WORKSPACE_NAME)
    cy.getBySel('remove-workspace-button').click()
    cy.getBySel('user-workspaces').should('contain', 'Your workspaces will appear here')
  })
})

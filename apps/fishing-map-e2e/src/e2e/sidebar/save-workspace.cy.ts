import {
  disablePopups,
  getWorkspace,
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

  it('Should create a workspace', () => {
    cy.getBySel('save-workspace-button').click()
    cy.getBySel('create-workspace-inpunt').clear()
    cy.getBySel('create-workspace-inpunt').type(WORKSPACE_NAME)
    cy.getBySel('create-workspace-button').click()
    getWorkspace().should('contain', WORKSPACE_NAME)
  })

  it('Should delete a workspace', () => {
    cy.get('a[href*="/user"]').contains(Cypress.env('apiUserInitials')).click()
    cy.getBySel('user-workspace').click()
    cy.get('a[href*="/fishing-activity"]').contains(WORKSPACE_NAME)
    cy.getBySel('remove-workspace-button').click()
    cy.getBySel('user-workspaces').should('contain', 'Your workspaces will appear here')
  })
})

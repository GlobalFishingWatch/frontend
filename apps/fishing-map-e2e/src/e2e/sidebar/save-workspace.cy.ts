import { SIDEBAR_USER_BUTTON } from '../../constants/buttons'
import { WORKSPACE_NAME } from '../../constants/workspace'
import { disablePopups, getWorkspaceTitle, waitForSidebarLoaded } from '../../support/app.po'
import { deleteUserWorkspaces } from '../../support/sidebar/save-workspace.po'

describe('Save a workspace', () => {
  before(() => {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
  })
  beforeEach(() => {
    deleteUserWorkspaces()
    disablePopups()
    cy.visit('/')
    waitForSidebarLoaded()
  })

  it('Should create and delete a workspace', () => {
    cy.getBySel('save-workspace-button').click()
    cy.getBySel('create-workspace-name').clear()
    cy.getBySel('create-workspace-name').type(WORKSPACE_NAME)
    cy.getBySel('create-workspace-button').click()
    getWorkspaceTitle().should('contain', WORKSPACE_NAME)
    cy.getBySel(SIDEBAR_USER_BUTTON).click()
    cy.getBySel('user-workspace').click()
    cy.getBySel('workspace-name').contains(WORKSPACE_NAME)
    cy.getBySel('remove-workspace-button').click()
    cy.getBySel('user-workspaces').should('exist')
  })
})

import { API_URL_WORKSPACES_DELETE, API_URL_WORKSPACES_LIST } from '../../constants/urls'

// Delete created workspaces by the user, REQUIRE user login before
export const deleteUserWorkspaces = () => {
  cy.getAllLocalStorage().then((result) => {
    console.log(result[Cypress.config('baseUrl').replace('/map', '')])
    cy.request({
      url: Cypress.env('publicApiGateway') + API_URL_WORKSPACES_LIST,
      auth: {
        bearer: result[Cypress.config('baseUrl').replace('/map', '')].GFW_API_USER_TOKEN,
      },
    }).then((response) => {
      const workspaces = response.body.entries
      workspaces
        .filter((workspace) => workspace.ownerType === 'user')
        .forEach((workspace) => {
          console.log(workspace)
          cy.request({
            method: 'DELETE',
            url:
              Cypress.env('publicApiGateway') +
              API_URL_WORKSPACES_DELETE.replace('%WORKSPACE_ID%', workspace.id),
            auth: {
              bearer: result[Cypress.config('baseUrl').replace('/map', '')].GFW_API_USER_TOKEN,
            },
          })
        })
    })
  })
}
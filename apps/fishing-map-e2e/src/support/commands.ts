// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void
    store(reducerName: string): void
  }
}

function loginViaAuthAPI(username: string, password: string) {
  // App landing page redirects to Auth0.
  cy.visit('/')
  // This is needed to ensure the cookies are send
  Cypress.Cookies.debug(true)
  // Login on Auth0.
  cy.origin(Cypress.env('apiAuth'), { args: { username, password } }, ({ username, password }) => {
    cy.visit(
      '/v2/auth?client=gfw&callback=http%3A%2F%2Flocalhost%3A3003%2F%3FcallbackUrlStorage%3Dtrue&locale=en'
    )
    cy.get('input#email').type(username)
    cy.get('input#password').type(password, { log: false })
    cy.get('input[type=submit]').click()
  })

  // Ensure API Auth has redirected us back to the app.
  // cy.url().should('equal', 'http://localhost:3003/')
}

Cypress.Commands.add('login', (username: string, password: string) => {
  const log = Cypress.log({
    displayName: 'GFW API LOGIN',
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  })
  log.snapshot('before')

  loginViaAuthAPI(username, password)

  log.snapshot('after')
  log.end()
})

Cypress.Commands.add('store', (reducerName = '') => {
  const log = Cypress.log({ name: 'redux store' })
  const cb = (state) => {
    log.set({
      message: JSON.stringify(state),
      consoleProps: () => state,
    })
  }
  return cy
    .window({ log: false })
    .then((window) => {
      return (window as any).store.getState()
    })
    .then((state) => {
      if (reducerName !== '') {
        return cy.wrap(state, { log: false }).its(reducerName)
      }
      return cy.wrap(state, { log: false })
    })
    .then(cb)
})

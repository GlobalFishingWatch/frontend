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
  // Close dialog popup
  cy.get('div[role=dialog] button[type=button][aria-label=close]').click()

  // Login on Auth0.
  cy.get('a[href*="auth"]', { timeout: 10000 }).click()
  cy.log(`logging in with ${username}`)

  cy.get('input#email').type(username)
  cy.get('input#password').type(password, { log: false })
  cy.get('input[type=submit]').click()

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

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  options = options || {}
  // Perform basic auth if defined in ENV variables
  if (Cypress.env('basicAuth') === 'Restricted') {
    options.auth = {
      username: Cypress.env('basicAuthUser'),
      password: Cypress.env('basicAuthPass'),
    }
  }
  // @ts-ignore
  return originalFn(url, options)
})

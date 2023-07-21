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
    getBySel(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
    getBySelLike(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
    findClass(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
  }
}

function loginViaAuthAPI(username: string, password: string) {
  // App landing page redirects to Auth0.
  cy.visit('/')

  // This is needed to ensure the cookies are send
  Cypress.Cookies.debug(true)

  // Clear local storage to ensure everything is clean before logging in
  cy.clearLocalStorage()

  // Reload the page to see that view if from anonnymous user
  cy.reload()

  // Close dialog popup
  cy.get('div[role=dialog] button[type=button][aria-label=close]').click()

  // Login on Auth0.
  cy.get('a[href*="auth"]', { timeout: 20000 }).click()
  cy.log(`logging in with ${username}`)

  cy.get('input#email').type(username)
  cy.get('input#password').type(password, { log: false })
  cy.get('input[type=submit]').click()

  // Ensure API Auth has redirected us back to the app.
  cy.url().should('match', /^http:\/\/localhost:3003/)
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

Cypress.Commands.add(
  'getBySel',
  (
    selector: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
  ) => {
    return cy.get(`[data-test=${selector}]`, options)
  }
)

Cypress.Commands.add(
  'getBySelLike',
  (
    selector: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
  ) => {
    return cy.get(`[data-test*=${selector}]`, options)
  }
)

// This is usefull to find a class and avoid the react hashes
Cypress.Commands.add(
  'findClass',
  (
    selector: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
  ) => {
    return cy.get(`[class^="${selector}"]`, options)
  }
)

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

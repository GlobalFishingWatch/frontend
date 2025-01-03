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
    forceClick(
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
    getBySel(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
    getBySelLike(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
    findBySelLike(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
    findBySel(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
    getByClass(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
    findByClass(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Cypress.Chainable<JQuery<HTMLElement>>
  }
}

Cypress.on('uncaught:exception', (err, runnable) => {
  console.error(err)
  // returning false here prevents Cypress from
  // failing the test
  return false
})

Cypress.Commands.add('forceClick', { prevSubject: 'element' }, (subject, options) => {
  cy.wrap(subject).click({ force: true })
})

function loginViaAuthAPI(username: string, password: string) {
  // App landing page redirects to Auth0.
  cy.visit('/')

  // This is needed to ensure the cookies are send
  Cypress.Cookies.debug(true)

  // Clear local storage to ensure everything is clean before logging in
  cy.clearLocalStorage()

  // Reload the page to see that view if from anonnymous user
  cy.reload()
  // @TODO: Remove thw wait when the bug in login is fixed "/index bug"

  cy.wait(5000)
  // Close dialog popup
  cy.get('div[role=dialog] button[type=button][aria-label=close]').click()

  // Login on Auth0.
  cy.getBySel('sidebar-login-icon', { timeout: 20000 }).click()
  cy.log(`logging in with ${username}`)

  cy.get('input#email').type(username)
  cy.get('input#password').type(password, { log: false })
  cy.get('input[type=submit]').click()

  // Ensure API Auth has redirected us back to the app, in development set your domain in .env
  cy.intercept('/v3/auth/tokens*').as('requestToken')
  cy.url().should('include', Cypress.config('baseUrl')).should('include', 'access-token=')

  // Validate that we request a token and is saved in the local storage
  cy.wait('@requestToken', { requestTimeout: 20000 }).then((interception) => {
    const token = interception.response.body.token

    cy.wait(1000) // After request the token give a second so it can be added to the localstorage after the resquest is completed
    cy.getAllLocalStorage().then((result) => {
      expect(result).to.deep.contain({
        [Cypress.config('baseUrl').replace('/map', '')]: {
          ...localStorage,
          GFW_API_USER_TOKEN: token,
        },
      })
    })
  })
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
  'getByClass',
  (
    selector: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
  ) => {
    return cy.get(`[class^="${selector}"]`, options)
  }
)

Cypress.Commands.add(
  'findByClass',
  { prevSubject: true },
  (
    subject: Cypress.Chainable<HTMLElement>,
    selector: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
  ) => {
    Cypress.log({
      name: 'findByClass',
      displayName: 'FIND BY CLASS',
      message: [`Try to find elements by class that starts with ${selector} in:`],
    })

    return cy.wrap(subject).find(`[class^="${selector}"]`, options)
  }
)

Cypress.Commands.add(
  'findBySel',
  { prevSubject: true },
  (
    subject: Cypress.Chainable<HTMLElement>,
    selector: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
  ) => {
    Cypress.log({
      name: 'findBySel',
      displayName: 'FIND BY DATA-TEST',
      message: [`💸 Try to find elements by data-test that is equal with ${selector} in:`],
    })

    return cy.wrap(subject).find(`[data-test="${selector}"]`, options)
  }
)

Cypress.Commands.add(
  'findBySelLike',
  { prevSubject: true },
  (
    subject: Cypress.Chainable<HTMLElement>,
    selector: string,
    options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
  ) => {
    Cypress.log({
      name: 'findBySelLike',
      displayName: 'FIND BY DATA-TEST (like)',
      message: [`Try to find elements by data-test that starts with ${selector} in:`],
    })

    return cy.wrap(subject).find(`[data-test^="${selector}"]`, options)
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

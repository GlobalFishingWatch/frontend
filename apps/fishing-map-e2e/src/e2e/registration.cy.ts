import { API_URL_REGISTRATION } from '../constants/urls'

//MAP-1492
describe('Register new user', () => {
  before(() => {
    cy.registrationPage()
  })

  it('Should validate incomplete fields', () => {
    cy.get('.btn.continue').click()

    cy.get('#firstName_error').should('be.visible').and('contain', 'required')
    cy.get('#lastName_error').should('be.visible').and('contain', 'required')
    cy.get('#email_error').should('be.visible').and('contain', 'required')
    cy.get('#country_error').should('be.visible').and('contain', 'required')
    cy.get('#organizationCategoryV2_error').should('be.visible').and('contain', 'required')
    cy.get('#password_error')
      .should('be.visible')
      .and('contain', 'Must have at least: 8 characters, 1 letter, 1 number')
    cy.get('#confirmPassword_error')
      .should('be.visible')
      .and('contain', 'Your passwords don’t match')
  })

  it('Should validate email field', () => {
    cy.get('input#firstName').type('Automation')
    cy.get('input#lastName').type('Test')

    cy.get('input#email').type('natitest@.com')
    cy.get('#country').select('Zimbabwe')
    cy.get(':nth-child(6) > .radio-options > :nth-child(7)').click() //improve this element
    cy.get('input#password').type('Gfwtest123')
    cy.get('input#confirmPassword').type('Gfwtest123')
    cy.get('.btn.continue').click()

    cy.get('#email_error').should('be.visible').and('contain', 'required') // validate email field
    cy.get('#email').clear()
    cy.get('input#email').type('registrationGFW@yopmail.com')
    cy.get('.btn.continue').click()

    cy.get('input#detectionAck').click()
    cy.get('input#tos').click()
    cy.get('[type="submit"]').click()
    cy.reload()
    cy.wait(500)

    cy.get('#email.error').should('be.visible')
    cy.get('.validation-error-msg')
      .should('be.visible')
      .and('contain.text', 'The email direction already exists in our database') //validates that the email already exists
  })

  it('Should complete registration', () => {
    cy.get('input#firstName').type('Automation')
    cy.get('input#lastName').type('Test')

    cy.get('#email').clear()
    cy.get('input#email').type('registrationGFW@yopmail.com')

    cy.get('#country').select('Zimbabwe')
    cy.get(':nth-child(6) > .radio-options > :nth-child(7)').click() //improve this element
    cy.get('input#password').type('Gfwtest123')
    cy.get('input#confirmPassword').type('Gfwtest123')
    cy.get('.btn.continue').click()

    cy.get('input#detectionAck').click()
    cy.get('input#tos').click()
    //cy.get('[type="submit"]').click()
    //cy.get('h1').should('be.visible').and('contain', 'Thanks for registering')
    //cy.get('.newsletter-grid').children().should('have.length', 4)

    cy.visit('https://yopmail.com/en/') // visits email inbox
    cy.get('#login').clear()
    cy.get('#login').type('registrationGFW@yopmail.com')
    cy.get('button[title="Check Inbox @yopmail.com"]').click()
    cy.get('iframe#ifmail').then(($iframe) => {
      const iframeBody = $iframe.contents().find('body')
      cy.wrap(iframeBody)
        .contains('VERIFY YOUR ADDRESS')
        .parent()
        .find('a')
        .invoke('attr', 'href')
        .then((verificationLink) => {
          cy.visit(verificationLink)
          cy.get('h1').should('contain.text', 'Login')
        })
    })
  })

  /*  after(() => {
    const email = 'registrationGFW@yopmail.com'
    cy.request({
      method: 'GET',
      url: `https://gateway.api.dev.globalfishingwatch.org/v3/auth/users?email=${email}`,
      headers: {
        Authorization: 'Bearer ' + Cypress.env('adminToken'),
      },
    }).then((response) => {
      console.log('Usuario creado:', response.body)
      cy.log(JSON.stringify(response.body))
    })
  }) */
})

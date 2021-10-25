describe('fishing-map', () => {
  beforeEach(() => cy.visit('/'))
  it('should contain a body', () => {
    cy.get('body').should('exist')
  })
})

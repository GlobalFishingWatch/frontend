import { getVmsActivityLayerPanel } from '../../support/app.po'

describe('vms', () => {
  beforeEach(() => cy.visit('/'))

  it('should include all sources available publicly', () => {
    // Open the filter popup
    getVmsActivityLayerPanel().find(`[data-test*="activity-layer-panel-btn-filter-vms-"]`).click()

    // Check that all vms layers are available
    cy.getBySelLike('activity-filters-option').contains('AIS')
    cy.getBySelLike('activity-filters-option').contains('Belize VMS')
    cy.getBySelLike('activity-filters-option').contains('Brazil Open Tuna Presence')
    cy.getBySelLike('activity-filters-option').contains('Chile VMS')
    cy.getBySelLike('activity-filters-option').contains('Costa Rica VMS')
    cy.getBySelLike('activity-filters-option').contains('Ecuador VMS')
    cy.getBySelLike('activity-filters-option').contains('Indonesia VMS')
    cy.getBySelLike('activity-filters-option').contains('Norway VMS')
    cy.getBySelLike('activity-filters-option').contains('Panama VMS')
    cy.getBySelLike('activity-filters-option').contains('Papua New Guinea VMS')
    cy.getBySelLike('activity-filters-option').contains('Peru VMS')
  })
})

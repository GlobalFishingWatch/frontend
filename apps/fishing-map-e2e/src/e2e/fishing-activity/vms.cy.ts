import { VMS_NAMES } from '../../constants/vms'
import { disablePopups, getVmsActivityLayerPanel, switchLanguage } from '../../support/app.po'

describe('vms', () => {
  beforeEach(() => {
    cy.visit('/')
    disablePopups()
  })

  //MAP-1215
  it('should include all sources available publicly', () => {
    // Be sure to use english or the names to test will fail
    switchLanguage('en')
    // Open the filter popup
    getVmsActivityLayerPanel()
      .find(`[data-test*="activity-layer-panel-btn-filter-vms"]`)
      .click({ force: true })
    cy.getBySelLike('activity-filters-input').click()
    // Check that all vms layers are available
    cy.getBySelLike('activity-filters-option').contains('AIS')
    VMS_NAMES.forEach((vms) => {
      cy.getBySelLike('activity-filters-option').contains(vms)
    })
  })
})

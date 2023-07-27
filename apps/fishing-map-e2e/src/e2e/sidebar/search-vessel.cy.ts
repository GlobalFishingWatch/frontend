import { API_URL_SEARCH_VESSELS, URL_YEAR_2018 } from '../../constants/urls'
import { SEARCH_VESSEL_MMSI, SEARCH_VESSEL_NAME } from '../../constants/vessels'
import { disablePopups, getTimeline, waitForSidebarLoaded } from '../../support/app.po'

describe('Basic search for a vessel and see it on the map', () => {
  before(() => {
    // I need to search as a anonymous user
    cy.clearAllLocalStorage().then(() => {
      disablePopups()
      cy.visit(URL_YEAR_2018)
    })
  })

  it('should search for a vessel by name "' + SEARCH_VESSEL_NAME + '" in the sidebar', () => {
    waitForSidebarLoaded()
    cy.getBySel('search-vessels-open').click()
    cy.intercept(API_URL_SEARCH_VESSELS).as('searchForVessels')
    cy.getBySel('seach-vessels-basic-input').type(SEARCH_VESSEL_NAME)

    // Wait while we perform the request for the vessels
    cy.wait('@searchForVessels', { requestTimeout: 10000 })

    // Click on the first result
    cy.getBySel('search-vessels-list')
      .findBySelLike('search-vessels-option-')
      .contains(SEARCH_VESSEL_NAME)
  })

  it(
    'should search for a vessel by mmsi "' + SEARCH_VESSEL_MMSI + '" in the sidebar and add it',
    () => {
      cy.intercept(API_URL_SEARCH_VESSELS).as('searchForVessels')
      cy.getBySel('seach-vessels-basic-input').clear().type(SEARCH_VESSEL_MMSI)

      // Wait while we perform the request for the vessels
      cy.wait('@searchForVessels', { requestTimeout: 10000 })

      cy.getBySel('search-vessels-list')
        .findBySelLike('search-vessels-option-')
        .eq(0)
        .findBySelLike('vessel-name')
        .then((vessel) => {
          // Click on the first result
          cy.getBySel('search-vessels-list').findBySelLike('search-vessels-option').eq(0).click()
          cy.getBySel('search-vessels-add-vessel').click()
          cy.getBySel('sidebar-container').scrollTo('center', { easing: 'linear', duration: 2000 })
          cy.getByClass('LayerPanel_name').contains(vessel.text()).should('exist')
        })
    }
  )

  it('should see the vessel track in the timebar', () => {
    getTimeline()
      // The tracks request can be heavy
      .findByClass('tracks_segment', { timeout: 20000 })
      .should('have.length.greaterThan', 4)
  })
})

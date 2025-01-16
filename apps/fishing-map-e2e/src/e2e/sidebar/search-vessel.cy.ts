import { SEARCH_VESSEL_MMSI, SEARCH_VESSEL_NAME } from '../../constants/search'
import { API_URL_SEARCH_VESSELS, URL_YEAR_2018 } from '../../constants/urls'
import {
  disablePopups,
  getDOMTimeout,
  getRequestTimeout,
  scrollSidebar,
  verifyTracksInTimebar,
  waitForSidebarLoaded,
} from '../../support/app.po'

describe('Basic search for a vessel', () => {
  before(() => {
    // I need to search as a anonymous user, the last update of cypress needed to add the eslit coment
     
    cy.clearAllLocalStorage().then(() => {
      disablePopups()
    })
  })
  beforeEach(() => {
    cy.visit(URL_YEAR_2018)
    waitForSidebarLoaded()
    cy.getBySel('search-vessels-open').click()
  })

  //MAP-1217
  it('should search for a vessel by name "' + SEARCH_VESSEL_NAME + '" in the sidebar', () => {
    cy.intercept(API_URL_SEARCH_VESSELS).as('searchForVessels')
    cy.getBySel('seach-vessels-basic-input').type(SEARCH_VESSEL_NAME)

    // Wait while we perform the request for the vessels
    cy.wait('@searchForVessels', getRequestTimeout(10000))

    // Click on the first result
    cy.getBySel('search-vessels-list')
      .findBySelLike('search-vessels-option-')
      .contains(SEARCH_VESSEL_NAME)
  })

  it(
    'should search for a vessel by mmsi "' + SEARCH_VESSEL_MMSI + '" in the sidebar and add it',
    () => {
      cy.intercept(API_URL_SEARCH_VESSELS).as('searchForVessels')
      cy.getBySel('seach-vessels-basic-input').clear()
      cy.getBySel('seach-vessels-basic-input').type(SEARCH_VESSEL_MMSI)

      // Wait while we perform the request for the vessels
      cy.wait('@searchForVessels', getRequestTimeout(10000))

      cy.getBySel('search-vessels-list')
        .findBySelLike('search-vessels-option-')
        .eq(0)
        .findBySelLike('link-vessel-profile')
        .then((vessel) => {
          // Click on the first result
          cy.getBySel('search-vessels-list')
            .findBySelLike('search-vessels-option-selection-0')
            .click()
          cy.getBySel('search-vessels-add-vessel').click()
          scrollSidebar('center', 2000)
          cy.getBySel('vessel-layer-vessel-name')
            .contains(vessel.text(), getDOMTimeout(10000))
            .should('exist')
        })
      verifyTracksInTimebar(4)
    }
  )
})

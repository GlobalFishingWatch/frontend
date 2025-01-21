import { SEARCH_VESSEL_MMSI } from '../../constants/search'
import { API_URL_SEARCH_VESSELS, URL_YEAR_2018 } from '../../constants/urls'
import {
  disablePopups,
  getDOMTimeout,
  getRequestTimeout,
  scrollSidebar,
  verifyTracksInTimebar,
  waitForSidebarLoaded,
} from '../../support/app.po'

describe('Access to vessel viewver - search', () => {
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
    cy.intercept(API_URL_SEARCH_VESSELS).as('searchForVessels')
    cy.getBySel('seach-vessels-basic-input').clear()
    cy.getBySel('seach-vessels-basic-input').type(SEARCH_VESSEL_MMSI)

    // Wait while we perform the request for the vessels
    cy.wait('@searchForVessels', getRequestTimeout(10000))
  })

  it(
    'should search for a vessel by mmsi "' +
      SEARCH_VESSEL_MMSI +
      '" and access to the profile in the search results',
    () => {
      cy.getBySel('search-vessels-list')
        .findBySelLike('search-vessels-option-')
        .eq(0)
        .findBySelLike('link-vessel-profile')
        .then((vessel) => {
          // Click on the first result
          cy.getBySel('search-vessels-list').findBySelLike('link-vessel-profile').click()
          cy.getBySel('vv-vessel-name').contains(vessel.text())
          verifyTracksInTimebar(3)
        })
    }
  )

  it(
    'should search for a vessel by mmsi "' +
      SEARCH_VESSEL_MMSI +
      '" and access to the profile in the sidebar',
    () => {
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
          cy.getBySel('vessel-layer-vessel-name').click({ force: true })
          cy.getBySel('vv-vessel-name').contains(vessel.text())
          verifyTracksInTimebar(3)
        })
    }
  )
})

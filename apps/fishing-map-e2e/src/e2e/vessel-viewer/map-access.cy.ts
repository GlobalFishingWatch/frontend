import { API_URL_VESSELS, URL_FULL_DATA_AREA } from '../../constants/urls'
import {
  disablePopups,
  getMapCanvas,
  getRequestTimeout,
  scrollSidebar,
  verifyTracksInTimebar,
  waitForMapLoadTiles,
} from '../../support/app.po'

describe('Access to vessel viewver - map', () => {
  beforeEach(() => {
    cy.visit(URL_FULL_DATA_AREA)
    disablePopups()
  })

  //MAP-1216
  it('Should access to the profile of a vessel when I click on a cell on the map', () => {
    cy.log('should pin a vessel from a cell in the map')
    waitForMapLoadTiles(3000) // Give 3 seconds more to paint data on the map
    cy.intercept(API_URL_VESSELS).as('searchForVessels')
    getMapCanvas().click('center', { force: true })
    scrollSidebar('center', 2000)

    cy.wait('@searchForVessels', getRequestTimeout(10000))
    cy.getBySel('vessels-table')
      .findBySelLike('vessels-table-item-0')
      .findBySelLike('link-vessel-profile')
      .click()
    verifyTracksInTimebar(4)
  })
})

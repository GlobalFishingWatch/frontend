import { API_URL_VESSELS, URL_FULL_DATA_AREA } from '../../constants/urls'
import {
  disablePopups,
  getMapCanvas,
  verifyTracksInTimebar,
  waitForMapLoadTiles,
} from '../../support/app.po'

describe('Interact with vessels', () => {
  before(() => {
    cy.visit(URL_FULL_DATA_AREA)
    disablePopups()
  })

  it('Select a vessel on the apparent fishing effort heat map with AIS source', () => {
    cy.log('should pin a vessel from a cell in the map')
    waitForMapLoadTiles(3000) // Give 3 seconds more to paint data on the map
    cy.intercept(API_URL_VESSELS).as('searchForVessels')
    getMapCanvas().click('center')
    cy.getBySel('sidebar-container').scrollTo('center', { easing: 'linear', duration: 2000 })
    cy.wait('@searchForVessels', { requestTimeout: 10000 })
    cy.getBySel('vessels-table').find('button').first().click()

    cy.log('shoud verify that the vessel was added to the sidebar')
    cy.getBySel('vessels-table')
      .findBySelLike('vessels-table-item-0')
      .findBySelLike('vessel-name')

      .then((vessel) => {
        cy.getBySel('vessel-layer-vessel-name').contains(vessel.text()).should('exist')
      })

    cy.log('should check if the track was added to the timebar')
    verifyTracksInTimebar(4)
  })
})

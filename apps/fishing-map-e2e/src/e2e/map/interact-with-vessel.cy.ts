import { API_URL_VESSELS, URL_FULL_DATA_AREA } from '../../constants/urls'
import { disablePopups, getMapCanvas, getTimeline, waitForMapLoadTiles } from '../../support/app.po'

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
    cy.getByClass('VesselsTable_vesselsTable').find('button').first().click()

    cy.log('shoud verify that the vessel was added to the sidebar')
    cy.getByClass('VesselsTable_vesselsTable')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .eq(1)
      .then((vessel) => {
        cy.getByClass('LayerPanel_name').contains(vessel.text()).should('exist')
      })

    cy.log('should check if the track was added to the timebar')
    getTimeline()
      // The tracks request can be heavy
      .findByClass(`tracks_segment`, { timeout: 20000 })
      .should('have.length.greaterThan', 4)
  })
})

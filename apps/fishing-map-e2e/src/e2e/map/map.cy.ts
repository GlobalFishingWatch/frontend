import { API_URL_4WINGS_TILES, API_URL_VESSELS, URL_FULL_DATA_AREA } from '../../constants/urls'
import { disablePopups, waitForMapLoadTiles } from '../../support/app.po'

describe('map', () => {
  it('should pin a vessel from a cell in the map', () => {
    disablePopups()
    cy.visit(URL_FULL_DATA_AREA)
    waitForMapLoadTiles(2000) // Give 2 seconds more to paint data on the map
    cy.intercept(API_URL_VESSELS).as('searchForVessels')
    cy.get('.maplibregl-canvas').click('center')
    cy.get('.scrollContainer').scrollTo('center', { easing: 'linear', duration: 2000 })
    cy.wait('@searchForVessels', { requestTimeout: 10000 })
    cy.getByClass('VesselsTable_vesselsTable').find('button').first().click()
    cy.getByClass('VesselsTable_vesselsTable')
      .find('tbody')
      .find('tr')
      .first()
      .find('td')
      .eq(1)
      .then((vessel) => {
        const textValue = vessel.text()
        cy.wrap(textValue).as('firstVessel')
      })
  })

  it('verify that the vessel was added to the sidebar', function () {
    cy.getByClass('LayerPanel_name').contains(this.firstVessel).should('exist')
  })
})

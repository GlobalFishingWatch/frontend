import { MAP_POPUP_EEZ_SECTION, SIDEBAR_TOGGLE_EEZ } from '../../constants/buttons'
import { SEARCH_EEZ, SEARCH_EEZ_FULL_NAME } from '../../constants/search'
import {
  disablePopups,
  getMapCanvas,
  getSidebar,
  scrollSidebar,
  waitForMapLoadTiles,
  waitForSidebarLoaded,
} from '../../support/app.po'

describe('See the creation of analysis for an area', () => {
  before(() => {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
  })
  beforeEach(() => {
    disablePopups()
    cy.visit('/')
    waitForSidebarLoaded()
    waitForMapLoadTiles()
    scrollSidebar('bottom', 1000)
    cy.getBySel(SIDEBAR_TOGGLE_EEZ).click()
    cy.getBySel('map-search-button').click()
    // I need to add a delay because it doesnt work propetly the autocomplete if we type so fast

    cy.getBySel('map-search-input').click().type(SEARCH_EEZ, { delay: 200 })
    cy.getBySel('map-search-results').findBySelLike('map-search-result').first().click()
    getMapCanvas().click('center')
    cy.getBySel(MAP_POPUP_EEZ_SECTION, { timeout: 10000 }).findBySelLike('open-analysis').click()
  })

  //MAP-1218
  it('Should create an analysis for an EEZ area', () => {
    getSidebar().findBySelLike('report-title').contains(SEARCH_EEZ_FULL_NAME)
    cy.getBySel('source-tags').findBySelLike('source-tag-item').contains('AIS')

    // Path tag is a needed element that should exist to draw the charts
    cy.getBySel('report-activity-evolution').find('path').should('exist')
    cy.getBySel('report-vessels-graph').find('path').should('exist')
    cy.getBySel('report-vessels-table').findBySelLike('vessel').should('exist')
  })

  it('Should download the vessels from an EEZ area', () => {
    cy.getBySel('download-vessel-table-report').click()

    cy.url().then((url) => {
      let params = new URLSearchParams(url)
      const start = params.get('start').replaceAll(':', '_')
      const end = params.get('end').replaceAll(':', '_')
      //Create the same file name that the component CSVLink is generating
      const downloadsFolder = Cypress.config('downloadsFolder')
      cy.readFile(`${downloadsFolder}/${SEARCH_EEZ_FULL_NAME}-${start}-${end}.csv`)
    })
  })
})

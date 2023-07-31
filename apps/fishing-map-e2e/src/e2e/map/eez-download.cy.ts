import {
  GROUPBY_DAY,
  GROUPBY_FLAG_GEAR,
  MAP_POPUP_EEZ_SECTION,
  SIDEBAR_TOGGLE_EEZ,
} from '../../constants/buttons'
import { SEARCH_EEZ, SEARCH_EEZ_FULL_NAME } from '../../constants/search'
import { API_URL_4WINGS_REPORT, API_URL_GALAPAGOS_INFO } from '../../constants/urls'
import {
  deleteDownloadsFolder,
  disablePopups,
  getDownloadsFolderPath,
  getMapCanvas,
  getQueryParam,
  scrollSidebar,
  waitForMapLoadTiles,
  waitForSidebarLoaded,
} from '../../support/app.po'

describe('See the creation of analysis for an area', () => {
  before(() => {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
  })
  beforeEach(() => {
    deleteDownloadsFolder()
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
    cy.intercept(API_URL_GALAPAGOS_INFO).as('areaInfo')
    cy.getBySel(MAP_POPUP_EEZ_SECTION, { timeout: 10000 })
      .findBySelLike('download-activity-layers')
      .click()
    cy.getBySel('download-activity-byvessel')
      .findBySelLike('area-name')
      .contains(SEARCH_EEZ_FULL_NAME)

    // The download button is not available until the data of the area is loaded
    cy.wait('@areaInfo')
  })

  afterEach(() => {
    cy.intercept(API_URL_4WINGS_REPORT).as('downloadReport')
    cy.getBySel('download-button').should('not.be.disabled').click()
    // This request takes for me 17s, so I use 30 just in case
    cy.wait('@downloadReport', { requestTimeout: 30000 })

    //Create the same file name that the component CSVLink is generating
    cy.url().then((url) => {
      const start = getQueryParam(url, 'start').replaceAll(':', '_')
      const end = getQueryParam(url, 'end').replaceAll(':', '_')
      //Create the same file name that the component CSVLink is generating
      cy.readFile(`${getDownloadsFolderPath()}/${SEARCH_EEZ_FULL_NAME} - ${start},${end}.zip`)
    })
  })

  it('Should download visible activity layers of ' + SEARCH_EEZ, () => {
    // With the default options everything in before each and after each is enought
  })

  it('Should download CUSTOM visible activity layers of ' + SEARCH_EEZ, () => {
    cy.getBySel(GROUPBY_FLAG_GEAR).click()
    cy.getBySel(GROUPBY_DAY).click()
  })
})

import { MAP_POPUP_EEZ_SECTION, SIDEBAR_TOGGLE_EEZ } from '../../constants/buttons'
import { SEARCH_EEZ, SEARCH_EEZ_FULL_NAME } from '../../constants/search'
import { API_URL_4WINGS_REPORT, API_URL_GALAPAGOS_INFO, URL_ONE_MONTH } from '../../constants/urls'
import {
  deleteDownloadsFolder,
  disablePopups,
  getDOMTimeout,
  getDownloadsFolderPath,
  getMapCanvas,
  getRequestTimeout,
  scrollSidebar,
  waitForMapLoadTiles,
  waitForSidebarLoaded,
} from '../../support/app.po'
import {
  filename,
  folderToUse,
  GROUPBY_DAY,
  GROUPBY_FLAG,
  GROUPBY_FLAG_GEAR,
  GROUPBY_GEAR,
  GROUPBY_MMSI,
  GROUPBY_MONTH,
  REPORT_FORMAT_CSV,
  REPORT_FORMAT_JSON,
  testCsvOptions,
  testJsonOptions,
  verifyFileDownload,
  zipFilename,
  zipPath} from '../../support/map/eez-download.po'

describe('Download reports for an area', () => {
  before(() => {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
  })
  beforeEach(() => {
    disablePopups()
    deleteDownloadsFolder()
    cy.visit(URL_ONE_MONTH)
    waitForSidebarLoaded()
    waitForMapLoadTiles()
    scrollSidebar('bottom', 1000)
    cy.getBySel(SIDEBAR_TOGGLE_EEZ).click()
    cy.getBySel('map-search-button').click()
    // I need to add a delay because it doesnt work propetly the autocomplete if we type so fast

    cy.getBySel('map-search-input').type(SEARCH_EEZ, { delay: 200 })
    cy.getBySel('map-search-results').findBySelLike('map-search-result').first().click()
    getMapCanvas().click('center', { force: true })
    cy.intercept(API_URL_GALAPAGOS_INFO).as('areaInfo')
    cy.getBySel(MAP_POPUP_EEZ_SECTION, getDOMTimeout(10000))
      .findBySelLike('download-activity-layers')
      .click()
    cy.getBySel('download-activity-byvessel')
      .findBySelLike('area-name')
      .contains(SEARCH_EEZ_FULL_NAME)

    // The download button is not available until the data of the area is loaded
    cy.wait('@areaInfo')
  })

  it('Should download Active vessels for ' + SEARCH_EEZ, () => {
    cy.intercept(API_URL_4WINGS_REPORT).as('downloadReport')
    cy.getBySel(`download-activity-vessel-button`).should('not.be.disabled').click()
    // This request takes for me 17s, so I use 40 just in case
    cy.wait('@downloadReport', getRequestTimeout(40000)).should((xhr) => {
      expect(xhr.response).to.have.property('statusCode', 200)
    })
    // testCsvOptions(
    //   'DOWNLOAD CSV - DEFAULT OPTIONS',
    //   'download-activity-byvessel',
    //   [],
    //   'activity-vessel',
    //   [
    //     'Time Range',
    //     'Vessel Name',
    //     'Flag',
    //     'Entry Timestamp',
    //     'Exit Timestamp',
    //     'Gear Type',
    //     'Vessel Type',
    //     'MMSI',
    //     'IMO',
    //     'CallSign',
    //     'First Transmission Date',
    //     'Last Transmission Date',
    //     'Apparent Fishing Hours',
    //   ]
    // )
    // testCsvOptions(
    //   'DOWNLOAD CSV - GROUP BY MMSI AND MONTH',
    //   'download-activity-byvessel',
    //   [REPORT_FORMAT_CSV, GROUPBY_MMSI, GROUPBY_MONTH],
    //   'activity-vessel',
    //   ['Time Range', 'mmsi', 'Entry Timestamp', 'Exit Timestamp', 'Apparent Fishing Hours']
    // )
    // testCsvOptions(
    //   'DOWNLOAD CSV -  GROUP BY GEAR+FLAG AND DAY',
    //   'download-activity-byvessel',
    //   [REPORT_FORMAT_CSV, GROUPBY_FLAG_GEAR, GROUPBY_DAY],
    //   'activity-vessel',
    //   ['Time Range', 'Flag', 'Geartype', 'Vessel IDs', 'Apparent Fishing Hours']
    // )
    // testJsonOptions(
    //   'DOWNLOAD JSON -  GROUP BY FLAG AND MONTH',
    //   'download-activity-byvessel',
    //   [REPORT_FORMAT_JSON, GROUPBY_FLAG, GROUPBY_MONTH],
    //   'activity-vessel',
    //   ['date', 'flag', 'hours', 'vesselIDs']
    // )
    // testJsonOptions(
    //   'DOWNLOAD JSON - GROUP BY GEAR AND DAY',
    //   'download-activity-byvessel',
    //   [REPORT_FORMAT_JSON, GROUPBY_GEAR, GROUPBY_DAY],
    //   'activity-vessel',
    //   ['date', 'geartype', 'hours', 'vesselIDs']
    // )
  })

  it('Should download gridded activity for ' + SEARCH_EEZ, () => {
    cy.getBySel('activity-modal-gridded-activity').click()
    cy.intercept(API_URL_4WINGS_REPORT).as('downloadReport')
    cy.getBySel(`download-activity-gridded-button`).should('not.be.disabled').click()
    // This request takes for me 17s, so I use 40 just in case
    cy.wait('@downloadReport', getRequestTimeout(40000)).should((xhr) => {
      expect(xhr.response).to.have.property('statusCode', 200)
    })
    // verifyFileDownload(zipPath, 'activity-gridded')
    // cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
    //   cy.readFile(getDownloadsFolderPath() + '/unzip/' + filename + folderToUse + '.tif')
    // })

    // testCsvOptions(
    //   'DOWNLOAD CSV - GROUP BY NONE, SELECTED TIME RANGE AND 0.1',
    //   'download-activity-gridded',
    //   [REPORT_FORMAT_CSV],
    //   'activity-gridded',
    //   ['Lat', 'Lon', 'Time Range', 'Vessel IDs', 'Apparent Fishing Hours']
    // )

    // testCsvOptions(
    //   'DOWNLOAD CSV - GROUP BY GEAR TYPE, MONTH AND 0.01',
    //   'download-activity-gridded',
    //   [REPORT_FORMAT_CSV, GROUPBY_GEAR, GROUPBY_MONTH, 'group-spatial-by-HIGH'],
    //   'activity-gridded',
    //   ['Lat', 'Lon', 'Time Range', 'geartype', 'Vessel IDs', 'Apparent Fishing Hours']
    // )

    // testCsvOptions(
    //   'DOWNLOAD CSV - GROUP BY FLAG, DAY AND 0.1',
    //   'download-activity-gridded',
    //   [REPORT_FORMAT_CSV, GROUPBY_FLAG, GROUPBY_DAY, 'group-spatial-by-LOW'],
    //   'activity-gridded',
    //   ['Lat', 'Lon', 'Time Range', 'flag', 'Vessel IDs', 'Apparent Fishing Hours']
    // )

    /*
    TODO: what is the problem with the selectos?
    testJsonOptions(
      'DOWNLOAD JSON - GROUP BY MMSI, MONTH AND 0.1',
      'download-activity-gridded',
      [REPORT_FORMAT_JSON, GROUPBY_MMSI, GROUPBY_MONTH, 'group-spatial-by-LOW'],
      'activity-gridded',
      ['date', 'entryTimestamp', 'exitTimestamp', 'hours', 'lat', 'lon', 'mmsi']
    )
    */

    // testJsonOptions(
    //   'DOWNLOAD JSON - GROUP BY FLAG GEAR, DAY AND 0.01',
    //   'download-activity-gridded',
    //   [REPORT_FORMAT_JSON, GROUPBY_FLAG_GEAR, GROUPBY_DAY, 'group-spatial-by-HIGH'],
    //   'activity-gridded',
    //   ['date', 'flag', 'geartype', 'hours', 'lat', 'lon', 'vesselIDs']
    // )
  })
})

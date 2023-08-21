import {
  GROUPBY_DAY,
  GROUPBY_FLAG,
  GROUPBY_FLAG_GEAR,
  GROUPBY_GEAR,
  GROUPBY_MMSI,
  GROUPBY_MONTH,
  MAP_POPUP_EEZ_SECTION,
  REPORT_FORMAT_CSV,
  REPORT_FORMAT_JSON,
  SIDEBAR_TOGGLE_EEZ,
} from '../../constants/buttons'
import { REPORT_CSV_COLUMNS, SEARCH_EEZ, SEARCH_EEZ_FULL_NAME } from '../../constants/search'
import { API_URL_4WINGS_REPORT, API_URL_GALAPAGOS_INFO, URL_ONE_MONTH } from '../../constants/urls'
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

// Static names and paths used for verifications
const start = getQueryParam(URL_ONE_MONTH.substring(1), 'start').replaceAll(':', '_')
const end = getQueryParam(URL_ONE_MONTH.substring(1), 'end').replaceAll(':', '_')
const filename = `${SEARCH_EEZ_FULL_NAME} - ${start},${end}`
const zipFilename = `${filename}.zip`
const jsonFilename = `${filename}.json`
const zipPath = `${getDownloadsFolderPath()}/${zipFilename}`
const jsonPath = `${getDownloadsFolderPath()}/${jsonFilename}`
const DATASET = 'public-global-fishing-effort:v20201001'
const folderToUse = '/layer-activity-data-0/public-global-fishing-effort-v20201001'

const selectOptions = (format: string, attribute: string, time: string) => {
  cy.getBySel(format).click()
  cy.getBySel(attribute).click()
  cy.getBySel(time).click()
}

const verifyJson = (attributes: string[]) => {
  cy.readFile(`${getDownloadsFolderPath()}/${jsonFilename}`).then((json) => {
    cy.wrap(json).its('entries').should('be.an', 'array')
    cy.wrap(json)
      .its('entries')
      .each((entry) => {
        cy.wrap(entry).should('have.any.keys', [DATASET])
        cy.wrap(entry[DATASET]).each((field) => cy.wrap(field).should('have.keys', attributes))
      })
  })
}

const verifyCSV = (attributes: string[]) => {
  cy.readFile(getDownloadsFolderPath() + '/unzip/' + filename + folderToUse + '.csv').then(
    (csvFile) => {
      attributes.forEach((col) => cy.wrap(csvFile).should('contain', col))
    }
  )
}

const verifyFileDownload = (file: string, button: string) => {
  cy.intercept(API_URL_4WINGS_REPORT).as('downloadReport')
  cy.getBySel(`download-${button}-button`).should('not.be.disabled').click()
  // This request takes for me 17s, so I use 30 just in case
  cy.wait('@downloadReport', { requestTimeout: 40000 })

  //Create the same file name that the component CSVLink is generating
  cy.readFile(file, { timeout: 15000 })
}

describe('Download reports for an area', () => {
  before(() => {
    cy.login(Cypress.env('apiAuthUser'), Cypress.env('apiAuthPass'))
  })
  beforeEach(() => {
    deleteDownloadsFolder()
    disablePopups()
    cy.visit(URL_ONE_MONTH)
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

  afterEach(() => {})

  it('Should download Active vessels for ' + SEARCH_EEZ, () => {
    verifyFileDownload(zipPath, 'activity-vessel')
    cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
      verifyCSV([
        'Time Range',
        'Vessel Name',
        'Flag',
        'Entry Timestamp',
        'Exit Timestamp',
        'Gear Type',
        'Vessel Type',
        'MMSI',
        'IMO',
        'CallSign',
        'First Transmission Date',
        'Last Transmission Date',
        'Apparent Fishing Hours',
      ])
    })

    cy.log('DOWNLOAD CSV - GROUP BY MMSI AND MONTH')
    deleteDownloadsFolder()
    selectOptions(REPORT_FORMAT_CSV, GROUPBY_MMSI, GROUPBY_MONTH)
    verifyFileDownload(zipPath, 'activity-vessel')
    cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
      verifyCSV([
        'Time Range',
        'mmsi',
        'Entry Timestamp',
        'Exit Timestamp',
        'Apparent Fishing Hours',
      ])
    })

    cy.log('DOWNLOAD CSV - GROUP BY GEAR+FLAG AND DAY')
    deleteDownloadsFolder()
    selectOptions(REPORT_FORMAT_CSV, GROUPBY_FLAG_GEAR, GROUPBY_DAY)
    verifyFileDownload(zipPath, 'activity-vessel')
    cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
      verifyCSV(['Time Range', 'Flag', 'Geartype', 'Vessel IDs', 'Apparent Fishing Hours'])
    })

    cy.log('DOWNLOAD JSON - GROUP BY FLAG AND MONTH')
    deleteDownloadsFolder()
    selectOptions(REPORT_FORMAT_JSON, GROUPBY_FLAG, GROUPBY_MONTH)
    verifyFileDownload(jsonPath, 'activity-vessel')
    verifyJson(['date', 'flag', 'hours', 'vesselIDs'])

    cy.log('DOWNLOAD JSON - GROUP BY GEAR AND DAY')
    deleteDownloadsFolder()
    selectOptions(REPORT_FORMAT_JSON, GROUPBY_GEAR, GROUPBY_DAY)
    verifyFileDownload(jsonPath, 'activity-vessel')
    verifyJson(['date', 'geartype', 'hours', 'vesselIDs'])
  })

  it('Should download gridded activity for ' + SEARCH_EEZ, () => {
    deleteDownloadsFolder()
    cy.getBySel('activity-modal-gridded-activity').click()
    verifyFileDownload(zipPath, 'activity-gridded')
    cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
      cy.readFile(getDownloadsFolderPath() + '/unzip/' + filename + folderToUse + '.tif')
    })

    cy.log('DOWNLOAD CSV - GROUP BY NONE, SELECTED TIME RANGE AND 0.1')
    deleteDownloadsFolder()
    cy.getBySel('download-activity-gridded').findBySelLike(REPORT_FORMAT_CSV).click()
    verifyFileDownload(zipPath, 'activity-gridded')
    cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
      verifyCSV(['Lat', 'Lon', 'Time Range', 'Vessel IDs', 'Apparent Fishing Hours'])
    })

    cy.log('DOWNLOAD CSV - GROUP BY GEAR TYPE, MONTH AND 0.01')
    deleteDownloadsFolder()
    cy.getBySel('download-activity-gridded').findBySelLike(REPORT_FORMAT_CSV).click()
    cy.getBySel('download-activity-gridded').findBySelLike(GROUPBY_GEAR).click()
    cy.getBySel('download-activity-gridded').findBySelLike(GROUPBY_MONTH).click()
    cy.getBySel('download-activity-gridded').findBySelLike('group-spatial-by-high').click()
    verifyFileDownload(zipPath, 'activity-gridded')
    cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
      verifyCSV(['Lat', 'Lon', 'Time Range', 'geartype', 'Vessel IDs', 'Apparent Fishing Hours'])
    })

    cy.log('DOWNLOAD CSV - GROUP BY FLAG, DAY AND 0.1')
    deleteDownloadsFolder()
    cy.getBySel('download-activity-gridded').findBySel(REPORT_FORMAT_CSV).click()
    cy.getBySel('download-activity-gridded').findBySel(GROUPBY_FLAG).click()
    cy.getBySel('download-activity-gridded').findBySel(GROUPBY_DAY).click()
    cy.getBySel('download-activity-gridded').findBySel('group-spatial-by-low').click()
    verifyFileDownload(zipPath, 'activity-gridded')
    cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
      verifyCSV(['Lat', 'Lon', 'Time Range', 'flag', 'Vessel IDs', 'Apparent Fishing Hours'])
    })

    cy.getBySel('activity-modal-gridded-activity').click()
    cy.log('DOWNLOAD JSON - GROUP BY MMSI, MONTH AND 0.1')
    deleteDownloadsFolder()
    cy.getBySel('download-activity-gridded').findBySel(REPORT_FORMAT_JSON).click()
    cy.getBySel('download-activity-gridded').findBySel(GROUPBY_MMSI).click()
    cy.getBySel('download-activity-gridded').findBySel(GROUPBY_MONTH).click()
    cy.getBySel('download-activity-gridded').findBySel('group-spatial-by-low').click()
    verifyFileDownload(jsonPath, 'activity-gridded')
    verifyJson(['date', 'entryTimestamp', 'exitTimestamp', 'hours', 'lat', 'lon', 'mmsi'])

    cy.log('DOWNLOAD JSON - GROUP BY FLAG GEAR, DAY AND 0.01')
    deleteDownloadsFolder()
    cy.getBySel('download-activity-gridded').findBySel(REPORT_FORMAT_JSON).click()
    cy.getBySel('download-activity-gridded').findBySel(GROUPBY_FLAG_GEAR).click()
    cy.getBySel('download-activity-gridded').findBySel(GROUPBY_DAY).click()
    cy.getBySel('download-activity-gridded').findBySel('group-spatial-by-high').click()
    verifyFileDownload(jsonPath, 'activity-gridded')
    verifyJson(['date', 'flag', 'geartype', 'hours', 'lat', 'lon', 'vesselIDs'])
  })
})

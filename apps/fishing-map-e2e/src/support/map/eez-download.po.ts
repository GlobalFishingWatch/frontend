import { SEARCH_EEZ_FULL_NAME } from '../../constants/search'
import { API_URL_4WINGS_REPORT, URL_ONE_MONTH } from '../../constants/urls'
import {
  deleteDownloadsFolder,
  getDOMTimeout,
  getDownloadsFolderPath,
  getQueryParam,
  getRequestTimeout,
} from '../app.po'

export const REPORT_FORMAT_JSON = 'report-format-JSON'
export const REPORT_FORMAT_CSV = 'report-format-CSV'

export const GROUPBY_FLAG = 'group-vessels-by-FLAG'
export const GROUPBY_MMSI = 'group-vessels-by-MMSI'
export const GROUPBY_GEAR = 'group-vessels-by-GEARTYPE'
export const GROUPBY_FLAG_GEAR = 'group-vessels-by-FLAGANDGEARTYPE'

export const GROUPBY_DAY = 'group-time-by-DAILY'
export const GROUPBY_MONTH = 'group-time-by-MONTHLY'

// Static names and paths used for verifications
// I added a random domain to build a full url
const start = getQueryParam('https://gfw.com' + URL_ONE_MONTH, 'start').replaceAll(':', '_')
const end = getQueryParam('https://gfw.com' + URL_ONE_MONTH, 'end').replaceAll(':', '_')
export const filename = `${SEARCH_EEZ_FULL_NAME} - ${start},${end}`
export const zipFilename = `${filename}.zip`
const jsonFilename = `${filename}.json`
export const zipPath = `${getDownloadsFolderPath()}/${zipFilename}`
export const jsonPath = `${getDownloadsFolderPath()}/${jsonFilename}`
const DATASET = 'public-global-fishing-effort:v20231026'
export const folderToUse = '/layer-activity-data-0/public-global-fishing-effort-v20231026'

export const verifyJson = (attributes: string[]) => {
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

export const verifyCSV = (attributes: string[]) => {
  cy.readFile(getDownloadsFolderPath() + '/unzip/' + filename + folderToUse + '.csv').then(
    (csvFile) => {
      attributes.forEach((col) => cy.wrap(csvFile).should('contain', col))
    }
  )
}

export const verifyFileDownload = (file: string, button: string) => {
  cy.intercept(API_URL_4WINGS_REPORT).as('downloadReport')
  cy.getBySel(`download-${button}-button`).should('not.be.disabled').click()
  // This request takes for me 17s, so I use 40 just in case
  cy.wait('@downloadReport', getRequestTimeout(40000))

  //Create the same file name that the component CSVLink is generating
  cy.readFile(file, getDOMTimeout(15000))
}

export const validateZipFile = (downloadContainer: string, columns: string[]) => {
  verifyFileDownload(zipPath, downloadContainer)
  cy.task('unzipping', { path: getDownloadsFolderPath() + '/', file: zipFilename }).then(() => {
    verifyCSV(columns)
  })
}

export const testCsvOptions = (
  description: string,
  container: string,
  buttons: string[],
  downloadContainer: string,
  columns: string[]
) => {
  cy.log(description)
  deleteDownloadsFolder()
  buttons.forEach((button) => cy.getBySel(container).findBySel(button).click())
  validateZipFile(downloadContainer, columns)
}

export const testCsvVesselActivityOptions = (
  description: string,
  buttons: string[],
  downloadContainer: string,
  columns: string[]
) => {
  cy.log(description)
  deleteDownloadsFolder()
  buttons.forEach((button) => cy.getBySel(button).click())
  validateZipFile(downloadContainer, columns)
}

export const testJsonOptions = (
  description: string,
  container: string,
  buttons: string[],
  downloadContainer: string,
  columns: string[]
) => {
  cy.log(description)
  deleteDownloadsFolder()
  buttons.forEach((button) => cy.getBySel(container).findBySel(button).click())
  verifyFileDownload(jsonPath, downloadContainer)
  verifyJson(columns)
}

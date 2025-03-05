import { HINTS } from 'apps/fishing-map/data/config'

import { HIGHLIGHT_DATAVIEW_INSTANCE_ID } from '../../../fishing-map/features/workspace/highlight-panel/highlight-panel.content'
import { API_URL_4WINGS_TILES } from '../constants/urls'

export const getGreeting = () => cy.get('h1')

export const getWorkspaceTitle = () => cy.getBySel('user-workspace-title')

export const getVmsActivityLayerPanel = () =>
  cy.getBySelLike('activity-layer-panel-vms', getDOMTimeout(20000))

export const getTimebar = () => cy.getByClass('Timebar_timebarWrapper', getDOMTimeout(5000))

export const getTimeline = () => cy.getBySel('timeline-graph')

export const getMapCanvas = () => cy.get('#map-wrapper canvas')

export const getSidebar = () => cy.getBySel('sidebar-container', getDOMTimeout(10000))

export const waitForSidebarLoaded = () =>
  getSidebar().find(`[data-test*="activity-section"]`, getDOMTimeout(10000)).should('exist')

export const waitForVesselViewerLoaded = () =>
  getSidebar().find(`[data-test*="vessel-profile-info"]`, getDOMTimeout(10000)).should('exist')

export const waitForMapLoadTiles = (extraDelay?: number) => {
  cy.intercept(API_URL_4WINGS_TILES).as('loadTiles')
  cy.wait('@loadTiles', getRequestTimeout(10000))
  if (extraDelay) {
    cy.wait(extraDelay)
  }
}

export const verifyTracksInTimebar = (segments?: number) => {
  getTimeline()
    // The tracks request can be heavy
    .findBySelLike(`tracks-segment`, getDOMTimeout(20000))
    .should('have.length.greaterThan', segments ?? 1)
}

// Remove the popups that blocks the normal use of the map
export const disablePopups = () => {
  localStorage.setItem('DisableWelcomePopup', 'true')
  localStorage.setItem('DisableSourceSwitchPopup', 'true')
  localStorage.setItem('HighlightPopup', `"${HIGHLIGHT_DATAVIEW_INSTANCE_ID}"`)
  localStorage.setItem('WelcomePopup', '{"visible":false,"showAgain":false}')
  localStorage.setItem('VesselProfilePopup', '{"visible":false,"showAgain":false}')
  localStorage.setItem(
    HINTS,
    '{"fishingEffortHeatmap":true,"filterActivityLayers":true,"clickingOnAGridCellToShowVessels":true,"changingTheTimeRange":true,"areaSearch":true,"periodComparisonBaseline":true}'
  )
}

export const switchLanguage = (language: string) => {
  const currentLanguage = localStorage.getItem('i18nextLng')
  if (currentLanguage !== language) {
    localStorage.setItem('i18nextLng', language)
    cy.reload()
  }
}

export const scrollSidebar = (position, duration = 0) =>
  cy.getBySel('sidebar-container').scrollTo(position, { easing: 'linear', duration: duration })

export const getDownloadsFolderPath = () => Cypress.config('downloadsFolder')
export const deleteDownloadsFolder = () => {
  cy.task('deleteFolder', getDownloadsFolderPath())
}

export const getQueryParam = (url: string, name: string) => {
  const urlComponent = new URL(url)
  const params = new URLSearchParams(urlComponent.search)
  return params.get(name)
}

/**
 *
 * @param aditionalTime if you don't set global timeouts but we want to keep longer timeouts for specific actions or requests
 */
export const getDOMTimeout = (aditionalTime?: number) => {
  return { timeout: Cypress.config('defaultCommandTimeout') + aditionalTime }
}

export const getRequestTimeout = (
  aditionalResquestTime?: number,
  aditionalResponseTime?: number
) => {
  return {
    requestTimeout: Cypress.config('requestTimeout') + aditionalResquestTime,
    responseTimeout: Cypress.config('responseTimeout') + aditionalResponseTime,
  }
}

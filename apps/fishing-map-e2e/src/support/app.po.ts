import { API_URL_4WINGS_TILES } from '../constants/urls'

export const getGreeting = () => cy.get('h1')

export const getVmsActivityLayerPanel = () =>
  cy.getBySelLike('activity-layer-panel-vms-', { timeout: 20000 })

export const getTimebar = () => cy.getByClass('Timebar_timebarWrapper', { timeout: 5000 })

export const getTimeline = () => cy.getBySel('timeline-graph')

export const getMapCanvas = () => cy.get('#map canvas')

export const getSidebar = () => cy.getBySel('sidebar-container', { timeout: 10000 })

export const waitForSidebarLoaded = () =>
  getSidebar().findByClass('Sections_container', { timeout: 10000 }).should('exist')

export const waitForMapLoadTiles = (extraDelay?: number) => {
  cy.intercept(API_URL_4WINGS_TILES).as('loadTiles')
  cy.wait('@loadTiles', { requestTimeout: 10000 })
  if (extraDelay) {
    cy.wait(extraDelay)
  }
}

export const verifyTracksInTimebar = (segments?: number) => {
  getTimeline()
    // The tracks request can be heavy
    .findBySelLike(`tracks-segment`, { timeout: 20000 })
    .should('have.length.greaterThan', segments ?? 1)
}

// Remove the popups that blocks the normal use of the map
export const disablePopups = () => {
  localStorage.setItem('DisableWelcomePopup', 'true')
  localStorage.setItem('DisableSourceSwitchPopup', 'true')
  localStorage.setItem('HighlightPopup', '"vms-with-png"')
  localStorage.setItem(
    'hints',
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

export const deleteDownloadsFolder = () => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  cy.task('deleteFolder', downloadsFolder)
}

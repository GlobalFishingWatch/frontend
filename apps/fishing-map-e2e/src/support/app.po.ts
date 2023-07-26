import { API_URL_4WINGS_TILES } from '../constants/urls'

export const getGreeting = () => cy.get('h1')

export const getVmsActivityLayerPanel = () =>
  cy.getBySelLike('activity-layer-panel-vms-', { timeout: 20000 })

export const getTimebar = () => cy.getByClass('Timebar_timebarWrapper', { timeout: 5000 })

export const getTimeline = () => cy.getBySel('timeline-graph')

export const waitForMapLoadTiles = (extraDelay?: number) => {
  cy.intercept(API_URL_4WINGS_TILES).as('loadTiles')
  cy.wait('@loadTiles', { requestTimeout: 10000 })
  if (extraDelay) {
    cy.wait(extraDelay)
  }
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

export const beforeTestSkip = () => {
  if (Cypress.browser.isHeaded) {
    cy.clearCookie('shouldSkip')
  } else {
    cy.getCookie('shouldSkip').then((cookie) => {
      if (cookie && typeof cookie === 'object' && cookie.value === 'true') {
        Cypress.runner.stop()
      }
    })
  }
}
export const afterTestSkip = function onAfterEach() {
  if (this.currentTest.state === 'failed') {
    cy.setCookie('shouldSkip', 'true')
    //set cookie to skip tests for further specs
    Cypress.runner.stop()
    //this will skip tests only for current spec
  }
}

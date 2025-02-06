import { URL_VESSEL_PROFILE_2020 } from '../../constants/urls'
import {
  disablePopups,
  switchLanguage,
  verifyTracksInTimebar,
  waitForSidebarLoaded,
} from '../../support/app.po'

// describe('Access to vessel viewer - direct', () => {
//   before(() => {
//     // I need to search as a anonymous user, the last update of cypress needed to add the eslit coment

//     cy.clearAllLocalStorage().then(() => {
//       disablePopups()
//       switchLanguage('en')
//     })
//   })

//   it('should access to a vessel profile using a link and check basic data after run migration updated', () => {
//     cy.visit(URL_VESSEL_PROFILE_2020)

//     cy.getBySel('migrate-workspace-btn').click()

//     waitForSidebarLoaded()

//     verifyTracksInTimebar(4)

//     // Do a quick test of the loaded content
//     cy.getBySel('vv-summary-loitering').should('exist')

//     cy.getBySel('vv-summary-tab').click()
//     cy.getBySel('vv-list-encounter').click()
//     cy.getBySel('vv-encounter-event-0').should('exist')
//     cy.getBySel('vv-encounter-event-1').should('exist')

//     cy.getBySel('vv-areas-tab').click()
//     cy.get('span').contains('South Georgia and the South Sandwich Islands')
//     cy.get('span').contains('Uruguay')

//     cy.getBySel('vv-area-fao').click()
//     cy.get('span').contains('Atlantic, Antarctic')

//     cy.getBySel('vv-area-rfmo').click()
//     cy.get('span').contains('ACAP')
//     cy.get('span').contains('IWC')
//     cy.get('span').contains('CCAMLR')

//     cy.getBySel('vv-area-mpa').click()
//     cy.get('span').contains(
//       'South Georgia and South Sandwich Islands Marine Protected Area - Marine Protected Area'
//     )
//     cy.get('span').contains('Outside MPA areas')

//     cy.getBySel('vv-related-tab').click()
//     cy.getBySel('link-vessel-profile').contains('La Manche')

//     cy.getBySel('vv-related-type-owners').click()
//     cy.getBySel('link-vessel-profile').contains('Antarctic Sea')
//     cy.getBySel('link-vessel-profile').contains('Gadus Neptun')

//     cy.getBySel('vv-insights-tab').click()
//     cy.get('#insights').contains('Vessel insights')
//   })
// })

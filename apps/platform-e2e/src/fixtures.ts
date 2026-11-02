/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook */
import { test as base } from 'playwright/test'

import { setLowResActivityTiles } from './helpers/map'
import { disableWelcomePopups } from './helpers/modals'
import { LoginPage } from './pages/LoginPage'
import { MapPage } from './pages/MapPage'
import { ReportPage } from './pages/ReportPage'
import { SearchPage } from './pages/SearchPage'
import { VesselProfilePage } from './pages/VesselProfilePage'

export const test = base.extend<{
  loginPage: LoginPage
  mapPage: MapPage
  reportPage: ReportPage
  searchPage: SearchPage
  vesselProfilePage: VesselProfilePage
  welcomePopupsDisabled: void
  lowResActivityTiles: void
}>({
  welcomePopupsDisabled: [
    async ({ page }, use) => {
      await disableWelcomePopups(page)
      await use()
    },
    { auto: true },
  ],
  lowResActivityTiles: [
    async ({ page }, use) => {
      await setLowResActivityTiles(page)
      await use()
    },
    { auto: true },
  ],
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context))
  },
  mapPage: async ({ page }, use) => {
    await use(new MapPage(page))
  },
  reportPage: async ({ page }, use) => {
    await use(new ReportPage(page))
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page))
  },
  vesselProfilePage: async ({ page }, use) => {
    await use(new VesselProfilePage(page))
  },
})

export { expect } from 'playwright/test'

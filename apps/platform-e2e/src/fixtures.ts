import { test as base } from 'playwright/test'

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
}>({
  welcomePopupsDisabled: [
    async ({ page }, use) => {
      await disableWelcomePopups(page)
      await use()
    },
    { auto: true },
  ],
  loginPage: async ({ page, context }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook
    await use(new LoginPage(page, context))
  },
  mapPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook
    await use(new MapPage(page))
  },
  reportPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook
    await use(new ReportPage(page))
  },
  searchPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook
    await use(new SearchPage(page))
  },
  vesselProfilePage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook
    await use(new VesselProfilePage(page))
  },
})

export { expect } from 'playwright/test'

/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook */
import { test as base } from 'playwright/test'

import { setLowResActivityTiles } from './helpers/map'
import { disableWelcomePopups } from './helpers/modals'
import { deleteUserResources, getCreatedUserResourceUrl } from './helpers/user-resources'
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
  userResourcesCleanup: void
}>({
  // The test user is shared by every run, so whatever a spec creates (datasets, workspaces,
  // reports, vessel groups) is deleted after it, passed or failed. A fixture rather than an
  // afterAll hook because it needs the test's logged-in `page`. A killed run still leaves its
  // resources behind, which is why specs also give them unique names.
  userResourcesCleanup: [
    async ({ page }, use) => {
      const created: Promise<string | undefined>[] = []
      page.on('response', (response) => {
        created.push(
          getCreatedUserResourceUrl(response).catch((error: Error) => {
            console.warn(`Cannot track created resource ${response.url()}: ${error.message}`)
            return undefined
          })
        )
      })
      await use()
      const urls = (await Promise.all(created)).filter((url): url is string => !!url)
      await deleteUserResources(page, urls)
    },
    { auto: true },
  ],
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

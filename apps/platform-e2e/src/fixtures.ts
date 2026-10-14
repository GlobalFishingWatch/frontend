/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook */
import { expect, test as base } from 'playwright/test'

import { trackForbiddenDatasetRequests } from './helpers/forbidden-datasets'
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
  pipe5DatasetsOnly: void
  noForbiddenDatasets: void
  webkitBasicAuthLoginRedirect: void
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
  // WebKit + basic auth (staging): the gateway answers the login form POST with a 302 back to
  // `<app>/platform/login?isPopup=true&access-token=…`. WebKit follows it without the basic-auth
  // credentials, gets 401 "Auth Required." and never answers the challenge, so the login popup
  // never closes. Here the POST is fetched without following the redirect and the popup is sent
  // to the Location with a script navigation (a GET), which WebKit does authenticate.
  webkitBasicAuthLoginRedirect: [
    async ({ context, browserName }, use) => {
      if (browserName === 'webkit' && process.env.BASIC_AUTH_USER) {
        await context.route('**/v3/auth/login*', async (route) => {
          if (route.request().method() !== 'POST') return route.fallback()
          const response = await route.fetch({ maxRedirects: 0 })
          const location = response.headers()['location']
          if (!location) return route.fulfill({ response })
          await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: `<script>location.replace(${JSON.stringify(location)})</script>`,
          })
        })
      }
      await use()
    },
    { auto: true },
  ],
  noForbiddenDatasets: [
    async ({ context }, use, testInfo) => {
      const forbidden = trackForbiddenDatasetRequests(context)
      await use()
      if (forbidden.size) {
        await testInfo.attach('forbidden-dataset-requests.json', {
          body: JSON.stringify(Object.fromEntries(forbidden), null, 2),
          contentType: 'application/json',
        })
      }
      expect(
        [...forbidden.keys()].sort(),
        'API requests using private (as guest) or Montenegro datasets'
      ).toEqual([])
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

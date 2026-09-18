import { test as base } from 'playwright/test'

import { disableWelcomePopups } from './helpers/modals'
import { LoginPage } from './pages/LoginPage'
import { ReportPage } from './pages/ReportPage'
import { SearchPage } from './pages/SearchPage'

export const test = base.extend<{
  loginPage: LoginPage
  reportPage: ReportPage
  searchPage: SearchPage
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
  reportPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook
    await use(new ReportPage(page))
  },
  searchPage: async ({ page }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook
    await use(new SearchPage(page))
  },
})

export { expect } from 'playwright/test'

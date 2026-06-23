import { test as base } from 'playwright/test'

import { disableWelcomePopups } from './helpers/modals'
import { LoginPage } from './pages/LoginPage'

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page, context }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook
    await use(new LoginPage(page, context))
  },
})

test.beforeEach(async ({ page }) => {
  await disableWelcomePopups(page)
})

export { expect } from 'playwright/test'

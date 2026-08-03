import { test as base } from 'playwright/test'

import { disableWelcomePopups } from './helpers/modals'
import { LoginPage } from './pages/LoginPage'

export const test = base.extend<{ loginPage: LoginPage; welcomePopupsDisabled: void }>({
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
})

export { expect } from 'playwright/test'

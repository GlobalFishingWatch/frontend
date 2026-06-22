import test from 'playwright/test'

import { disableWelcomePopups } from '../helpers/modals'
import { LoginPage } from '../pages/LoginPage'

test.beforeEach(async ({ page }) => {
  await disableWelcomePopups(page)
})

test('Login - should allow a user to log in and log out', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login()

  await loginPage.openUserPanel()
  await loginPage.expectUserVisible()

  await loginPage.logout()
  await loginPage.expectGuest()
})

test('Login - should persist the session across a reload (server-side)', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login()

  await page.reload()

  await loginPage.expectLoggedIn()
  await loginPage.openUserPanel()
  await loginPage.expectUserVisible()
})

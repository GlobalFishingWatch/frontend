import { test } from '../fixtures'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Login - should allow a user to log in and log out', async ({ loginPage }) => {
  await loginPage.login()

  await loginPage.openUserPanel()
  await loginPage.expectUserVisible()

  await loginPage.logout()
  await loginPage.expectGuest()
})

test('Login - should persist the session across a reload (server-side)', async ({
  loginPage,
  page,
}) => {
  await loginPage.login()

  await page.reload()

  await loginPage.expectLoggedIn()
  await loginPage.openUserPanel()
  await loginPage.expectUserVisible()
})

test('Login - should refresh an expired access token on reload (SSR)', async ({ loginPage }) => {
  await loginPage.login()

  // Simulate an expired access token while the refresh token survives.
  await loginPage.clearUserToken()

  await loginPage.expectUserTokenCleared()
  await loginPage.expectRefreshTokenPresent()

  await loginPage.reload()

  await loginPage.expectLoggedIn()
  await loginPage.expectUserTokenPresent()
})

test('Login - should fall back to the guest user when cookies are cleared', async ({
  loginPage,
}) => {
  await loginPage.login()

  await loginPage.clearCookies()
  await loginPage.reload()

  await loginPage.expectGuest()
})

test('Login - should sync login across tabs', async ({ loginPage }) => {
  const newTabPage = await loginPage.newTab()
  await newTabPage.expectGuest()

  await loginPage.login()

  await newTabPage.expectLoggedIn()
  await newTabPage.close()
})

test('Login - should sync logout across tabs', async ({ loginPage }) => {
  await loginPage.login()

  const newTabPage = await loginPage.newTab()
  await newTabPage.expectLoggedIn()

  await loginPage.openUserPanel()
  await loginPage.logout()
  await loginPage.expectGuest()

  await newTabPage.expectGuest()
  await newTabPage.close()
})

test('Login - a tab opened after a token rotation resolves the rotated session', async ({
  loginPage,
}) => {
  await loginPage.login()

  await loginPage.clearUserToken()

  await loginPage.expectUserTokenCleared()
  await loginPage.expectRefreshTokenPresent()

  await loginPage.reload()
  await loginPage.expectLoggedIn()

  const newTabPage = await loginPage.newTab()
  await newTabPage.expectLoggedIn()
  await newTabPage.openUserPanel()
  await newTabPage.expectUserVisible()
  await newTabPage.close()
})

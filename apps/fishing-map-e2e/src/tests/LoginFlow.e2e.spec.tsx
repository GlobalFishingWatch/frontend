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

test('Login - should refresh an expired access token on reload (SSR)', async ({
  loginPage,
  page,
  context,
}) => {
  await context.clearCookies({ name: loginPage.USER_TOKEN_COOKIE_KEY })

  let cookies = await context.cookies()
  await loginPage.expectUserTokenCleared(cookies)
  await loginPage.expectRefreshTokenPresent(cookies)

  await page.reload()

  await loginPage.expectLoggedIn()

  cookies = await context.cookies()
  await loginPage.expectUserTokenPresent(cookies)
})

test('Login - should fall back to the guest user when cookies are cleared', async ({
  loginPage,
  page,
  context,
}) => {
  await loginPage.login()

  await context.clearCookies()
  await page.reload()

  await loginPage.expectGuest()
})

test.fixme('Login - should sync login across tabs', async ({ loginPage }) => {
  const newTabPage = await loginPage.newTab()
  await newTabPage.expectGuest()

  await loginPage.login()

  await newTabPage.expectLoggedIn()
  await newTabPage.page.close()
})

test.fixme('Login - should sync logout across tabs', async ({ loginPage }) => {
  await loginPage.login()

  const newTabPage = await loginPage.newTab()
  await newTabPage.expectLoggedIn()

  await loginPage.openUserPanel()
  await loginPage.logout()
  await loginPage.expectGuest()

  await newTabPage.expectGuest()
  await newTabPage.page.close()
})

test.fixme('Login - a tab opened after a token rotation resolves the rotated session', async ({
  loginPage,
  context,
}) => {
  await loginPage.login()

  await context.clearCookies({ name: loginPage.USER_TOKEN_COOKIE_KEY })

  const cookies = await context.cookies()
  await loginPage.expectUserTokenCleared(cookies)
  await loginPage.expectRefreshTokenPresent(cookies)

  await loginPage.reload()
  await loginPage.expectLoggedIn()

  const newTabPage = await loginPage.newTab()
  await newTabPage.expectLoggedIn()
  await newTabPage.openUserPanel()
  await newTabPage.expectUserVisible()
  await newTabPage.page.close()
})

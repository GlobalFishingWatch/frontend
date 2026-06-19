import type { BrowserContext } from 'playwright/test'
import test, { expect } from 'playwright/test'

import {
  expectGuest,
  expectLoggedIn,
  loggedInLink,
  loginViaPopup,
  performPopupLogin,
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from './helpers/auth'
import { waitForHydration } from './helpers/hydration'
import { disableWelcomePopups } from './helpers/modals'

export async function openTab(context: BrowserContext) {
  const tab = await context.newPage()
  await disableWelcomePopups(tab)
  await tab.goto('/')
  await waitForHydration(tab)
  return tab
}

// These tests all authenticate the same test account against the real auth server, which cannot handle concurrent logins
test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page }) => {
  await disableWelcomePopups(page)
})

test('Login - should allow a user to log in and log out', async ({ page }) => {
  await loginViaPopup(page)

  await loggedInLink(page).click()
  await page.waitForURL('**/user*')
  await expect(page.getByText('frontend test')).toBeVisible()
  await expect(page.getByText('frontendproject@yopmail.com')).toBeVisible()

  await page.getByTestId('logout-button').click()

  await expect(page.getByText('frontendproject@yopmail.com')).toBeHidden()
})

test('Login - should persist the session across a reload (server-side)', async ({ page }) => {
  await loginViaPopup(page)

  await page.reload()

  const userLink = loggedInLink(page)
  await expect(userLink).toBeVisible({ timeout: 30000 })
  await userLink.click()
  await page.waitForURL('**/user*')
  await expect(page.getByText('frontend test')).toBeVisible()
  await expect(page.getByText('frontendproject@yopmail.com')).toBeVisible()
})

test('Login - should refresh an expired access token on reload (SSR)', async ({
  page,
  context,
}) => {
  await loginViaPopup(page)

  await context.clearCookies({ name: USER_TOKEN_COOKIE_KEY })
  await expect(async () => {
    const cookies = await context.cookies()
    expect(cookies.find((c) => c.name === USER_TOKEN_COOKIE_KEY)).toBeUndefined()
    expect(cookies.find((c) => c.name === USER_REFRESH_TOKEN_COOKIE_KEY)?.value).toBeTruthy()
  }).toPass()

  await page.reload()

  await expectLoggedIn(page)

  const cookies = await context.cookies()
  expect(cookies.find((c) => c.name === USER_TOKEN_COOKIE_KEY)?.value).toBeTruthy()
})

test('Login - should fall back to the guest user when cookies are cleared', async ({
  page,
  context,
}) => {
  await loginViaPopup(page)

  await context.clearCookies()
  await page.reload()

  await expectGuest(page)
})

test('Login - should sync login across tabs', async ({ page, context }) => {
  await page.goto('/')

  const tabB = await openTab(context)
  await expectGuest(tabB)

  await performPopupLogin(page)

  await expectLoggedIn(tabB)
  await tabB.close()
})

test('Login - should sync logout across tabs', async ({ page, context }) => {
  await loginViaPopup(page)

  const tabB = await openTab(context)
  await expectLoggedIn(tabB)

  await loggedInLink(page).click()
  await page.waitForURL('**/user*')
  await page.getByTestId('logout-button').click()
  await expectGuest(page)

  await expectGuest(tabB)
  await tabB.close()
})

test('Login - a tab opened after a token rotation resolves the rotated session', async ({
  page,
  context,
}) => {
  await loginViaPopup(page)

  await context.clearCookies({ name: USER_TOKEN_COOKIE_KEY })
  await expect(async () => {
    const cookies = await context.cookies()
    expect(cookies.find((c) => c.name === USER_TOKEN_COOKIE_KEY)).toBeUndefined()
    expect(cookies.find((c) => c.name === USER_REFRESH_TOKEN_COOKIE_KEY)?.value).toBeTruthy()
  }).toPass()
  await page.reload()
  await expectLoggedIn(page)

  const tabB = await openTab(context)
  await expectLoggedIn(tabB)
  await loggedInLink(tabB).click()
  await tabB.waitForURL('**/user*')
  await expect(tabB.getByText('frontendproject@yopmail.com')).toBeVisible()
  await tabB.close()
})

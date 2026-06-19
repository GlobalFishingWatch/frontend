import type { Page } from 'playwright/test'
import { expect } from 'playwright/test'

import {
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from '../../../fishing-map/features/app/app.config'

export { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY }

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || ''
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || ''

export const loggedInLink = (page: Page) => page.getByTestId('sidebar-user-link')
export const guestLoginLink = (page: Page) => page.getByTestId('sidebar-login-link')

export async function expectLoggedIn(page: Page) {
  await expect(loggedInLink(page)).toBeVisible({ timeout: 30000 })
}

export async function expectGuest(page: Page) {
  await expect(guestLoginLink(page)).toBeVisible({ timeout: 30000 })
}

export async function performPopupLogin(page: Page) {
  const loginLink = guestLoginLink(page)
  await expect(loginLink).toBeVisible()

  let popup: Page | undefined
  await expect(async () => {
    const popupPromise = page.waitForEvent('popup', { timeout: 5000 })
    await loginLink.click()
    popup = await popupPromise
  }).toPass({ timeout: 10000 })
  if (!popup) throw new Error('Login popup did not open')

  await popup.waitForURL('**/v3/auth*')
  await popup.getByRole('textbox', { name: 'Email' }).fill(TEST_USER_EMAIL)
  await popup.getByRole('textbox', { name: 'Password' }).fill(TEST_USER_PASSWORD)
  await popup.getByRole('button', { name: 'Login' }).click()

  await popup.waitForEvent('close')

  await expectLoggedIn(page)
}

// The welcome modal is dismissed by the spec's beforeEach; here we only navigate and log in.
export async function loginViaPopup(page: Page) {
  await page.goto('/')
  await performPopupLogin(page)
}

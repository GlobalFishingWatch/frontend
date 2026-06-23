import type { BrowserContext, Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import {
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from '../../../fishing-map/features/app/app.config'
import { waitForHydration } from '../helpers/hydration'
import { disableWelcomePopups } from '../helpers/modals'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var "${name}". Set it in apps/fishing-map-e2e/.env`)
  }
  return value
}

export class LoginPage {
  private page: Page
  readonly context: BrowserContext
  readonly guestLoginIcon: Locator
  readonly userLink: Locator
  readonly logoutButton: Locator
  readonly TEST_USER_EMAIL = requireEnv('TEST_USER_EMAIL')
  readonly TEST_USER_PASSWORD = requireEnv('TEST_USER_PASSWORD')
  readonly TEST_USER_NAME = requireEnv('TEST_USER_NAME')

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
    this.guestLoginIcon = page.getByTestId('sidebar-login-link')
    this.userLink = page.getByTestId('sidebar-user-link')
    this.logoutButton = page.getByTestId('logout-button')
  }

  async login() {
    await expect(this.guestLoginIcon).toBeVisible()

    await waitForHydration(this.page)

    const popupPromise = this.page.waitForEvent('popup', { timeout: 30_000 })
    await this.guestLoginIcon.click()
    const popup = await popupPromise

    await popup.waitForURL('**/v3/auth*')
    await popup.getByRole('textbox', { name: 'Email' }).fill(this.TEST_USER_EMAIL)
    await popup.getByRole('textbox', { name: 'Password' }).fill(this.TEST_USER_PASSWORD)
    await popup.getByRole('button', { name: 'Login' }).click()

    await popup.waitForEvent('close')
    await expect(this.userLink).toBeVisible()
  }

  async newTab() {
    const tab = await this.context.newPage()
    await disableWelcomePopups(tab)
    await tab.goto('/')
    await waitForHydration(tab)
    return new LoginPage(tab, this.context)
  }

  async openUserPanel() {
    await this.userLink.click()
    await this.page.waitForURL('**/user*')
  }

  async logout() {
    await this.logoutButton.click()
  }

  async reload() {
    await this.page.reload()
  }

  async close() {
    await this.page.close()
  }

  async clearUserToken() {
    await this.context.clearCookies({ name: USER_TOKEN_COOKIE_KEY })
  }

  async clearCookies() {
    await this.context.clearCookies()
  }

  private async getCookie(name: string) {
    const cookies = await this.context.cookies()
    return cookies.find((c) => c.name === name)?.value
  }

  async expectLoggedIn() {
    await expect(this.userLink).toBeVisible()
  }

  async expectUserVisible() {
    await expect(this.page.getByText(this.TEST_USER_NAME)).toBeVisible()
    await expect(this.page.getByText(this.TEST_USER_EMAIL)).toBeVisible()
  }

  async expectGuest() {
    await expect(this.guestLoginIcon).toBeVisible()
  }

  async expectUserTokenCleared() {
    expect(await this.getCookie(USER_TOKEN_COOKIE_KEY)).toBeUndefined()
  }
  async expectUserTokenPresent() {
    expect(await this.getCookie(USER_TOKEN_COOKIE_KEY)).toBeTruthy()
  }

  async expectRefreshTokenPresent() {
    expect(await this.getCookie(USER_REFRESH_TOKEN_COOKIE_KEY)).toBeTruthy()
  }

  async expectRefreshTokenCleared() {
    expect(await this.getCookie(USER_REFRESH_TOKEN_COOKIE_KEY)).toBeUndefined()
  }
}

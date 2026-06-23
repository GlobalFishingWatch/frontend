import type { BrowserContext, Cookie, Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import {
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from '../../../fishing-map/features/app/app.config'
import { waitForHydration } from '../helpers/hydration'
import { disableWelcomePopups } from '../helpers/modals'

export class LoginPage {
  private page: Page
  readonly context: BrowserContext
  readonly guestLoginIcon: Locator
  readonly userLink: Locator
  readonly logoutButton: Locator
  readonly TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || ''
  readonly TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || ''
  readonly TEST_USER_NAME = process.env.TEST_USER_NAME || ''
  readonly USER_TOKEN_COOKIE_KEY = USER_TOKEN_COOKIE_KEY
  readonly USER_REFRESH_TOKEN_COOKIE_KEY = USER_REFRESH_TOKEN_COOKIE_KEY

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
    this.guestLoginIcon = page.getByTestId('sidebar-login-link')
    this.userLink = page.getByTestId('sidebar-user-icon')
    this.logoutButton = page.getByTestId('logout-button')
  }

  async login() {
    await expect(this.guestLoginIcon).toBeVisible()

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

  async expectUserTokenCleared(cookies: Cookie[]) {
    expect(cookies.find((c) => c.name === this.USER_TOKEN_COOKIE_KEY)?.value).toBeUndefined()
  }
  async expectUserTokenPresent(cookies: Cookie[]) {
    expect(cookies.find((c) => c.name === this.USER_TOKEN_COOKIE_KEY)?.value).toBeTruthy()
  }

  async expectRefreshTokenPresent(cookies: Cookie[]) {
    expect(cookies.find((c) => c.name === this.USER_REFRESH_TOKEN_COOKIE_KEY)?.value).toBeTruthy()
  }

  async expectRefreshTokenCleared(cookies: Cookie[]) {
    expect(
      cookies.find((c) => c.name === this.USER_REFRESH_TOKEN_COOKIE_KEY)?.value
    ).toBeUndefined()
  }
}

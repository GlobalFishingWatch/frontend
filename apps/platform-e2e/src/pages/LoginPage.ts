import type { BrowserContext, Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import {
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from '../../../platform/features/app/cookies.config'
import { waitForHydration } from '../helpers/hydration'
import { disableWelcomePopups } from '../helpers/modals'
import { MAP_PATH } from '../paths'

const GATEWAY_SESSION_COOKIE = 'koa.sess'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var "${name}". Set it in apps/platform-e2e/.env`)
  }
  return value
}

export class LoginPage {
  private page: Page
  readonly context: BrowserContext
  readonly guestLoginIcon: Locator
  readonly userLink: Locator
  readonly logoutButton: Locator
  readonly settingsButton: Locator
  readonly appContainer: Locator
  readonly TEST_USER_EMAIL = requireEnv('TEST_USER_EMAIL')
  readonly TEST_USER_PASSWORD = requireEnv('TEST_USER_PASSWORD')
  readonly TEST_USER_NAME = requireEnv('TEST_USER_NAME')

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
    this.guestLoginIcon = page.getByTestId('sidebar-login-link')
    this.userLink = page.getByTestId('sidebar-user-link')
    this.logoutButton = page.getByTestId('logout-button')
    this.settingsButton = page.getByTestId('settings-button')
    this.appContainer = page.locator('#app-layout-content')
  }

  private async openLoginPopup() {
    await expect(this.guestLoginIcon).toBeVisible()

    await waitForHydration(this.page)

    const popupPromise = this.page.waitForEvent('popup', { timeout: 30_000 })
    await this.guestLoginIcon.click()
    const popup = await popupPromise

    await popup.waitForURL('**/v3/auth*')
    return popup
  }

  async login() {
    const popup = await this.openLoginPopup()

    await popup.getByRole('textbox', { name: 'Email' }).fill(this.TEST_USER_EMAIL)
    await popup.getByRole('textbox', { name: 'Password' }).fill(this.TEST_USER_PASSWORD)
    await popup.getByRole('button', { name: 'Login' }).click()

    await popup.waitForEvent('close')
    await expect(this.userLink).toBeVisible()
  }

  async loginWithPopupsBlocked() {
    await this.page.addInitScript(() => {
      window.open = () => null
    })
    await this.page.reload()
    await waitForHydration(this.page)

    const returnPath = new URL(this.page.url()).pathname
    await this.guestLoginIcon.click()

    await this.page.waitForURL('**/v3/auth*')
    await this.page.getByRole('textbox', { name: 'Email' }).fill(this.TEST_USER_EMAIL)
    await this.page.getByRole('textbox', { name: 'Password' }).fill(this.TEST_USER_PASSWORD)
    await this.page.getByRole('button', { name: 'Login' }).click()

    await this.page.waitForURL(`**${returnPath}`)
    await expect(this.userLink).toBeVisible()
  }

  // Submits bad credentials; popup stays open on the auth URL instead of closing.
  async loginExpectingFailure(password: string) {
    const popup = await this.openLoginPopup()

    await popup.getByRole('textbox', { name: 'Email' }).fill(this.TEST_USER_EMAIL)
    await popup.getByRole('textbox', { name: 'Password' }).fill(password)
    await popup.getByRole('button', { name: 'Login' }).click()

    // Login failed → popup does not close, stays on the auth page.
    await expect(popup).toHaveURL(/\/v3\/auth/)
    await expect(this.guestLoginIcon).toBeVisible()
  }

  // Opens the login popup then closes it without submitting.
  async cancelLogin() {
    const popup = await this.openLoginPopup()
    await popup.close()
  }

  async newTab() {
    const tab = await this.context.newPage()
    await disableWelcomePopups(tab)
    await tab.goto(MAP_PATH)
    await waitForHydration(tab)
    return new LoginPage(tab, this.context)
  }

  async openUserPanel() {
    await this.userLink.click()
    await this.page.waitForURL('**/user*')
  }

  async logout() {
    const signOutRequest = this.context.waitForEvent('request', {
      predicate: (request) => request.url().includes('/v3/auth/logout-session'),
      timeout: 30_000,
    })
    await this.logoutButton.click()
    await signOutRequest
  }

  private async openSettingsPopup() {
    const popupPromise = this.page.waitForEvent('popup', { timeout: 30_000 })
    await this.settingsButton.click()
    const popup = await popupPromise
    await popup.waitForURL('**/v3/auth/settings*')
    return popup
  }

  async getSettingsUrl() {
    const popup = await this.openSettingsPopup()
    const url = popup.url()
    await popup.close()
    return url
  }

  async emitGatewaySessionEnded() {
    const popup = await this.openSettingsPopup()
    await popup.evaluate(() => {
      ;(window as unknown as { notifyOpener: (type: string) => void }).notifyOpener(
        'gfw:session-ended'
      )
    })
    await popup.close()
  }

  async expectSettingsRequiresLogin(settingsUrl: string) {
    const tab = await this.context.newPage()
    await tab.goto(settingsUrl)
    // No gateway session left → the settings page redirects to the login form.
    await expect(tab).toHaveURL(/\/v3\/auth\?/)
    await tab.close()
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

  async clearRefreshToken() {
    await this.context.clearCookies({ name: USER_REFRESH_TOKEN_COOKIE_KEY })
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

  async expectAppReady() {
    await expect(this.appContainer).toBeVisible()
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

  async expectGatewaySessionPresent() {
    await expect.poll(() => this.getCookie(GATEWAY_SESSION_COOKIE)).toBeTruthy()
  }

  async expectGatewaySessionCleared() {
    await expect.poll(() => this.getCookie(GATEWAY_SESSION_COOKIE)).toBeUndefined()
  }
}

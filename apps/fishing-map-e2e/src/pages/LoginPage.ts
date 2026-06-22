import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

export class LoginPage {
  readonly page: Page
  readonly guestLoginIcon: Locator
  readonly userLink: Locator
  readonly logoutButton: Locator
  readonly TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || ''
  readonly TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || ''
  readonly TEST_USER_NAME = process.env.TEST_USER_NAME || ''

  constructor(page: Page) {
    this.page = page
    this.guestLoginIcon = page.locator('[data-test="sidebar-login-icon"]')
    this.userLink = page.getByTestId('sidebar-login-icon')
    this.logoutButton = page.getByTestId('logout-button')
  }

  async login() {
    await this.page.goto('/')

    await expect(this.guestLoginIcon).toBeVisible()

    const popupPromise = this.page.waitForEvent('popup')
    await this.guestLoginIcon.click()
    const popup = await popupPromise

    await popup.waitForURL('**/v3/auth*')
    await popup.getByRole('textbox', { name: 'Email' }).fill(this.TEST_USER_EMAIL)
    await popup.getByRole('textbox', { name: 'Password' }).fill(this.TEST_USER_PASSWORD)
    await popup.getByRole('button', { name: 'Login' }).click()

    await popup.waitForEvent('close')
    await expect(this.userLink).toBeVisible()
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
}

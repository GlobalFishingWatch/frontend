import type { Page } from 'playwright/test'
import test, { expect } from 'playwright/test'

async function disableWelcomeModal(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'WelcomePopup',
      JSON.stringify({ visible: false, showAgain: false })
    )
  })
}

async function loginViaPopup(page: Page) {
  await disableWelcomeModal(page)
  await page.goto('/')

  const loginIcon = page.locator('[data-test="sidebar-login-icon"]')
  await expect(loginIcon).toBeVisible()

  const popupPromise = page.waitForEvent('popup')
  await loginIcon.click()
  const popup = await popupPromise

  await popup.waitForURL('**/v3/auth*')
  await popup.getByRole('textbox', { name: 'Email' }).fill(process.env.TEST_USER_EMAIL || '')
  await popup.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_USER_PASSWORD || '')
  await popup.getByRole('button', { name: 'Login' }).click()

  await popup.waitForEvent('close')

  await expect(page.getByTestId('sidebar-login-icon')).toBeVisible()
}

test('Login - should allow a user to log in and log out', async ({ page }) => {
  await loginViaPopup(page)

  await page.getByTestId('sidebar-login-icon').click()
  await page.waitForURL('**/user*')
  await expect(page.getByText('frontend test')).toBeVisible()
  await expect(page.getByText('frontendproject@yopmail.com')).toBeVisible()

  await page.getByTestId('logout-button').click()

  await expect(page.getByText('frontendproject@yopmail.com')).toBeHidden()
})

test('Login - should persist the session across a reload (server-side)', async ({ page }) => {
  await loginViaPopup(page)

  await page.reload()

  const userLink = page.getByTestId('sidebar-login-icon')
  await expect(userLink).toBeVisible({ timeout: 30000 })
  await userLink.click()
  await page.waitForURL('**/user*')
  await expect(page.getByText('frontend test')).toBeVisible()
  await expect(page.getByText('frontendproject@yopmail.com')).toBeVisible()
})

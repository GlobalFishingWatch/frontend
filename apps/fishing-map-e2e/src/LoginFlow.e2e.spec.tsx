import type { Page } from 'playwright/test'
import test, { expect } from 'playwright/test'

// The "Welcome to the Map" modal overlays page content and intercepts clicks. It is
// driven by a localStorage flag (usehooks-ts useLocalStorage, key 'WelcomePopup'), so
// pre-seed it as hidden before any app script runs. addInitScript also applies to
// reloads/navigations, so the modal never opens for the whole test.
async function disableWelcomeModal(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'WelcomePopup',
      JSON.stringify({ visible: false, showAgain: false })
    )
  })
}

// Drives the SSO popup login from a guest session and waits for the opener to
// finish exchanging the access token (loginServerFn) and refetching data.
async function loginViaPopup(page: Page) {
  await disableWelcomeModal(page)
  await page.goto('/')

  // Guest: the sidebar user icon opens the SSO login in a popup window.
  // (The guest icon exposes `data-test`; the logged-in /user link uses `data-testid`.)
  // Longer timeout: the icon only renders once the guest user resolves from the API.
  const loginIcon = page.locator('[data-test="sidebar-login-icon"]')
  await expect(loginIcon).toBeVisible({ timeout: 30000 })

  const popupPromise = page.waitForEvent('popup')
  await loginIcon.click()
  const popup = await popupPromise

  // The SSO form lives in the popup (separate origin) — fill + submit there.
  await popup.waitForURL('**/v3/auth*')
  await popup.getByRole('textbox', { name: 'Email' }).fill(process.env.TEST_USER_EMAIL || '')
  await popup.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_USER_PASSWORD || '')
  await popup.getByRole('button', { name: 'Login' }).click()

  // The popup posts the access token to the opener and closes itself.
  await popup.waitForEvent('close')

  // Login is resolved when the sidebar user button flips from the loading spinner to
  // the logged-in /user link (data-testid) — a deterministic signal, unlike
  // networkidle which never settles on the map (continuous tile/data requests).
  await expect(page.getByTestId('sidebar-login-icon')).toBeVisible({ timeout: 30000 })
}

test('Login - should allow a user to log in and log out', async ({ page }) => {
  await loginViaPopup(page)

  // Logged in: the same icon now links to /user. Open the user panel and assert it
  // navigated and shows the logged-in account.
  await page.getByTestId('sidebar-login-icon').click()
  await page.waitForURL('**/user*')
  await expect(page.getByText('frontend test')).toBeVisible()
  await expect(page.getByText('frontendproject@yopmail.com')).toBeVisible()

  await page.getByTestId('logout-button').click()

  // Back to guest: the user panel is gone (logout cleared the cookies + session).
  await expect(page.getByText('frontendproject@yopmail.com')).toBeHidden()
})

test('Login - should persist the session across a reload (server-side)', async ({ page }) => {
  await loginViaPopup(page)

  // Reload: the client Redux store is thrown away and rebuilt from the SSR loader,
  // which resolves the user from the auth cookies on the server (getUserState →
  // fetchUserFromRequest). No SSO popup / re-login should be needed.
  await page.reload()

  // Still logged in after the reload: the sidebar button resolves to the /user link
  // (data-testid), not the guest login icon (data-test) and not the loading spinner.
  // Opening it must NOT trigger an SSO popup.
  const userLink = page.getByTestId('sidebar-login-icon')
  await expect(userLink).toBeVisible({ timeout: 30000 })
  await userLink.click()
  await page.waitForURL('**/user*')
  await expect(page.getByText('frontend test')).toBeVisible()
  await expect(page.getByText('frontendproject@yopmail.com')).toBeVisible()
})

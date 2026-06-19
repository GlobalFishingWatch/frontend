import test, { expect } from 'playwright/test'

test('Log01 - should allow a user to log in and log out', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  await page.getByTestId('modal-close-button').click()

  // Click the login button and wait for the auth popup window
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByText('login').click()])
  await popup.waitForLoadState()
  await popup.locator('#email').fill(process.env.TEST_USER_EMAIL || '')
  await popup.locator('#password').fill(process.env.TEST_USER_PASSWORD || '')
  await popup.getByRole('button', { name: 'Login' }).click()

  await page.getByTestId('sidebar-login-icon').click()

  await page.waitForLoadState('networkidle')

  expect(page.getByText('frontend test')).toBeVisible()
  expect(page.getByText('frontendproject@yopmail.com')).toBeVisible()

  await page.waitForSelector('button:has-text("Log out")')
  await page.click('button:has-text("Log out")')

  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('login-link')) //.toBeVisible()
})

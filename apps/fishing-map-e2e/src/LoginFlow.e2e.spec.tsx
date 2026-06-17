import test, { expect } from 'playwright/test'

test('Log01 - should allow a user to log in and log out', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  await page.getByTestId('modal-close-button').click()
  // Click the login button
  await page.getByText('login').click()

  expect(page.url()).toContain('/v3/auth')

  await page.waitForURL('**/v3/auth*')

  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.TEST_USER_EMAIL || '')
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_USER_PASSWORD || '')

  await page.getByRole('button', { name: 'Login' }).click()

  await page.getByTestId('sidebar-login-icon').click()

  await page.waitForLoadState('networkidle')

  expect(page.getByText('Francisco Pacio')).toBeVisible()
  expect(page.getByText('francisco.pacio+testing@globalfishingwatch.org')).toBeVisible()

  await page.getByRole('button', { name: 'LOG OUT' }).click()

  await page.waitForURL('**/map/index*')
})

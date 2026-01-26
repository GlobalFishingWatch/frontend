import test, { expect } from 'playwright/test'

test('Log01 - should allow a user to log in and log out', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  await page.getByTestId('modal-close-button').click()
  // Click the login button
  await page.getByText('login').click()

  expect(page.url()).toContain(
    'https://gateway.api.staging.globalfishingwatch.org/v3/auth?client=gfw&callback=http%3A%2F%2Flocalhost%3A3003%2Fmap%2Findex%3FcallbackUrlStorage%3Dtrue&locale=en'
  )

  await page.waitForURL(
    'https://gateway.api.staging.globalfishingwatch.org/v3/auth?client=gfw&callback=http%3A%2F%2Flocalhost%3A3003%2Fmap%2Findex%3FcallbackUrlStorage%3Dtrue&locale=en'
  )

  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.TEST_USER_EMAIL || '')
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_USER_PASSWORD || '')

  await page.getByRole('button', { name: 'Login' }).click()

  await page.getByTestId('sidebar-login-icon').click()

  await page.waitForLoadState('networkidle')

  expect(page.getByText('Acid Tango')).toBeVisible()
  expect(page.getByText('carlos+q@acidtango.com')).toBeVisible()

  await page.getByRole('button', { name: 'LOG OUT' }).click()

  await page.waitForURL(
    'http://localhost:3003/map/index?start=2025-10-04T00%3A00%3A00.000Z&end=2026-01-04T00%3A00%3A00.000Z&longitude=26&latitude=19&zoom=1.49'
  )
})

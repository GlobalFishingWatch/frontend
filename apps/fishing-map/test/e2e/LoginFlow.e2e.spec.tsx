import test, { expect } from 'playwright/test'

test('should allow a user to log in and log out', async ({ page }) => {
  // Go to the login page
  await page.goto('/')

  await page.getByRole('button', { name: 'Close' }).click()
  // Click the login button
  await page.getByText('Login').click()

  await page.waitForURL(
    'https://gateway.api.staging.globalfishingwatch.org/v3/auth?client=gfw&callback=http%3A%2F%2Flocalhost%3A3003%2Fmap%3FcallbackUrlStorage%3Dtrue&locale=en'
  )

  await page.getByRole('textbox', { name: 'Email' }).fill('carlos+q@acidtango.com')
  await page.getByRole('textbox', { name: 'Password' }).fill('sTUuUZAx8qtfuZf')

  await page.getByRole('button', { name: 'Login' }).click()

  await page.getByTestId('sidebar-login-icon').click()

  await page.getByRole('button', { name: 'LOG OUT' }).click()

  await page.waitForURL(
    'http://localhost:3003/map/index?start=2025-09-19T00%3A00%3A00.000Z&end=2025-12-19T00%3A00%3A00.000Z&longitude=26&latitude=19&zoom=1.49'
  )

  expect(page.getByText('Login')).toBeVisible()
})

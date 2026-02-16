import { expect, test } from 'playwright/test'

test('Report01 - Create report area', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  // close welcome modal
  await page.getByTestId('modal-close-button').click()
  await page.getByText('Dismiss').first().click()

  await page.locator('[data-test="context-layer-context-layer-eez"]').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(3000)

  await page.click('#view-mapViewport', { position: { x: 8, y: 385 } })

  await page.waitForTimeout(3000)

  expect(page.getByText('Ecuadorian Exclusive Economic Zone')).toBeVisible()

  await page.locator('[data-test="open-analysis"]').click()

  await page.waitForLoadState('networkidle')

  expect(page.getByText('Ecuadorian EEZ 251,938 km²')).toBeVisible()

  await page.waitForTimeout(5000)

  expect(
    page.locator('[data-test="source-tag-item-public-global-fishing-effort:v4.0"]')
  ).toBeVisible()

  expect(
    page.getByText('23,354 hours ± 74% of activity in the area between Oct 4, 2025 and Jan 4, 2026')
  ).toBeVisible()
})

test('Report02 - View full report area', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  // close welcome modal
  await page.getByTestId('modal-close-button').click()
  await page.getByText('Dismiss').first().click()

  await page.locator('[data-test="context-layer-context-layer-eez"]').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(3000)

  await page.click('#view-mapViewport', { position: { x: 8, y: 385 } })

  await page.waitForTimeout(3000)

  expect(page.getByText('Ecuadorian Exclusive Economic Zone')).toBeVisible()

  await page.locator('[data-test="open-analysis"]').click()

  expect(page.getByText('Ecuadorian EEZ 251,938 km²')).toBeVisible()

  await page.waitForTimeout(3000)

  await page.getByText('Log in', { exact: true }).click()

  await page.waitForURL('**/v3/auth*')

  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.TEST_USER_EMAIL || '')
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_USER_PASSWORD || '')

  await page.getByRole('button', { name: 'Login' }).click()

  await page.waitForURL('**/map/fishing-activity/**/report/**')

  await page.locator('[data-test="see-vessel-table-activity-report"]').click()

  await page.waitForTimeout(5000)

  expect(page.getByText('Florida')).toBeVisible()
  expect(page.getByRole('button', { name: 'Ecuador' }).first()).toBeVisible()
  expect(page.getByText('369.61')).toBeVisible()
})

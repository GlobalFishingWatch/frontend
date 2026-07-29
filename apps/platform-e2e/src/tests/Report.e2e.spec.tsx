import { expect, test } from 'playwright/test'

test('Report01 - Create report area', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')
  // close welcome modal
  await page.getByTestId('modal-close-button').click()
  await page.waitForLoadState('networkidle')
  // If it doesn't wait for the network to be idle, the test will fail because the modal is still open and the click will not work
  await page.getByText('Dismiss').first().click()

  await page.locator('[data-testid="context-layer-context-layer-eez"]').scrollIntoViewIfNeeded()
  await page.locator('[data-testid="context-layer-context-layer-eez"]').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(3000)

  await page.click('#view-mapViewport', { position: { x: 8, y: 385 } })

  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(3000)

  expect(page.getByText('Ecuadorian Exclusive Economic Zone')).toBeVisible()

  await page.locator('[data-testid="open-analysis"]').click()

  await page.waitForLoadState('load')

  expect(page.getByText('Ecuadorian EEZ 251,938 km²')).toBeVisible()

  await page.waitForTimeout(5000)

  expect(
    page.locator('[data-test="source-tag-item-public-global-fishing-effort:v4.0"]')
  ).toBeVisible()
})

test.skip('Report02 - View full report area', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  // close welcome modal
  await page.getByTestId('modal-close-button').click()
  await page.waitForLoadState('networkidle')
  await page.getByText('Dismiss').first().click()

  await page.locator('[data-testid="context-layer-context-layer-eez"]').scrollIntoViewIfNeeded()
  await page.locator('[data-testid="context-layer-context-layer-eez"]').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(3000)

  await page.click('#view-mapViewport', { position: { x: 8, y: 385 } })

  await page.waitForTimeout(3000)

  expect(page.getByText('Ecuadorian Exclusive Economic Zone')).toBeVisible()

  await page.locator('[data-testid="open-analysis"]').click()

  expect(page.getByText('Ecuadorian EEZ 251,938 km²')).toBeVisible()

  await page.waitForTimeout(3000)

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('[data-testid="login-link"]').first().click(),
  ])
  await popup.waitForLoadState()
  await popup.locator('#email').fill(process.env.TEST_USER_EMAIL || '')
  await popup.locator('#password').fill(process.env.TEST_USER_PASSWORD || '')

  await popup.getByRole('button', { name: 'Login' }).click()

  await page.getByTestId('see-vessel-table-activity-report').click()

  await page.waitForTimeout(5000)

  expect(page.getByText('Florida')).toBeVisible()
  expect(page.getByRole('button', { name: 'Ecuador' }).first()).toBeVisible()
  expect(page.getByText('369.61')).toBeVisible()
})

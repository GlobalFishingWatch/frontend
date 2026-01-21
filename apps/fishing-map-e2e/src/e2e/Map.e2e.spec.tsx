import test, { expect } from 'playwright/test'

test('Map01 - should select a vessel from map tile', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  // close welcome modal
  await page.getByTestId('modal-close-button').click()
  await page.getByText('Dismiss').first().click()

  await page.getByText('month').first().click()

  await page.waitForURL(
    'http://localhost:3003/map/index?longitude=26&latitude=19&zoom=1.49&start=2025-01-01T00%3A00%3A00.000Z&end=2026-01-01T00%3A00%3A00.000Z'
  )

  expect(page.url()).toContain('start=2025-01-01T00%3A00%3A00.000Z')
  expect(page.url()).toContain('end=2026-01-01T00%3A00%3A00.000Z')

  await page.click('#view-mapViewport', { position: { x: 8, y: 385 } })

  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  expect(page.locator('#map-container').getByText('Apparent fishing effort (AIS)')).toBeVisible()
  expect(page.getByText('1,305.77 hours')).toBeVisible()
  expect(page.getByText('Rolton')).toBeVisible()
})

test('Map02 - Filter map by flag ', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  // close welcome modal
  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByText('Dismiss').first().click()

  await page.locator('[data-test="activity-layer-panel-ais"]').hover()
  await page.locator('[data-test="activity-layer-panel-ais"]').getByLabel('Open filters').click()

  const flagFilter = page.getByPlaceholder('All').first()
  await flagFilter.click()
  await flagFilter.fill('Panama')
  await page.getByText('Panama', { exact: true }).first().click()
  await flagFilter.press('Tab')
  await page.getByText('Confirm').click()

  await page.waitForLoadState('networkidle')

  await page.click('#view-mapViewport', { position: { x: 5, y: 385 } })

  await page.waitForTimeout(5000)

  expect(page.locator('#map-container').getByText('Apparent fishing effort (AIS)')).toBeVisible()
  expect(page.locator('#map-container').getByText('VEN')).not.toBeVisible()
  expect(page.locator('#map-container').getByText('MEX')).not.toBeVisible()
  expect(page.locator('#map-container').getByText('PAN').first()).toBeVisible()
})

test('Map03 - Add a layer and filter by vessel type', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto('/')

  // close welcome modal
  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByText('Dismiss').click()

  await page
    .locator('section')
    .filter({ hasText: 'Activity (2)Apparent fishing' })
    .getByLabel('Add layer')
    .click()

  await page.getByRole('button', { name: 'Add to workspace' }).nth(2).click()

  await page.waitForLoadState('networkidle')

  await page.getByText('Vessel presence').first().hover()

  await page.getByLabel('Open filters').first().click()

  await page.getByPlaceholder('All').nth(1).click()

  await page.getByText('Passenger').click()
  await page.getByPlaceholder('Passenger').press('Tab')

  await page.getByText('Confirm').click()

  await page.waitForLoadState('networkidle')

  await page.click('#view-mapViewport', { position: { x: 5, y: 385 } })

  await page.waitForTimeout(2000)

  expect(page.locator('#map-container').getByText('Vessel presence')).toBeVisible()
  expect(page.locator('#map-container').getByText('Cargo')).not.toBeVisible()
  expect(page.locator('#map-container').getByText('Passenger').first()).toBeVisible()
})

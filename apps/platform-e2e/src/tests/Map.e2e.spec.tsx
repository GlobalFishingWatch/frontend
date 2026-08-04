import { expect, test } from '../fixtures'
import { clickMapUntilVisible } from '../helpers/map'
import { MAP_PATH } from '../paths'

test('Map01 - should select a vessel from map tile', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto(MAP_PATH)

  await page.waitForLoadState('networkidle')

  await page.getByText('month').first().click()

  await page.waitForURL('**start*')
  //await page.waitForURL('networkidle')

  expect(page.url()).toContain('start=2025-01-01T')
  expect(page.url()).toContain('end=2026-01-01T')

  await page.waitForLoadState('networkidle')

  await clickMapUntilVisible(
    page,
    { x: 8, y: 385 },
    page.locator('#map-container').getByText('Apparent fishing effort (VMS)')
  )
  // Weak and wrong conditions
  //await expect(page.getByText('1,305.77 hours')).toBeVisible()
  //await expect(page.getByText('Rolton')).toBeVisible()
})

test('Map02 - Filter map by flag ', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto(MAP_PATH)

  await page.locator('[data-test="activity-layer-panel-ais"]').hover()
  await page.locator('[data-test="activity-layer-panel-ais"]').getByLabel('Open filters').click()

  const flagFilter = page.getByPlaceholder('All').first()
  await flagFilter.click()
  await flagFilter.fill('Panama')
  await page.getByText('Panama', { exact: true }).first().click()
  await flagFilter.press('Tab')
  await page.getByText('Confirm').click()

  await page.waitForLoadState('networkidle')

  await clickMapUntilVisible(
    page,
    { x: 5, y: 385 },
    page.locator('#map-container').getByText('Apparent fishing effort (AIS)')
  )
  await expect(page.locator('#map-container').getByText('VEN')).not.toBeVisible()
  await expect(page.locator('#map-container').getByText('MEX')).not.toBeVisible()
  await expect(page.locator('#map-container').getByText('PAN').first()).toBeVisible()
})

test.skip('Map03 - Add a layer and filter by vessel type', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto(MAP_PATH)

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

  await expect(page.locator('#map-container').getByText('Vessel presence')).toBeVisible()
  await expect(page.locator('#map-container').getByText('Cargo')).not.toBeVisible()
  await expect(page.locator('#map-container').getByText('Passenger').first()).toBeVisible()
})

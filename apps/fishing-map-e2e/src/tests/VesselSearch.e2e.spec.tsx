import { expect, test } from 'playwright/test'

test('Search01 - Basic vessel search', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto(
    '/map/vessel-search?end=2026-01-04T00%3A00%3A00.000Z&qry=GABU+REEFER&start=2025-10-04T00%3A00%3A00.000Z'
  )
  await page.waitForLoadState('networkidle')

  await page.getByTestId('modal-close-button').click()

  await page.waitForLoadState('networkidle')

  // Typing is not triggering the search event. Nor adding QRY to the URL.
  //await page.getByPlaceholder('Type to search for vessels (Name, IMO, MMSI or call sign)').fill('GABU REEFER')
  //await page.waitForLoadState('networkidle')
  //await page.waitForTimeout(5000)

  expect(page.getByText('616852000')).toBeVisible()

  await page.locator('[data-testid="link-vessel-profile"]').first().click()

  await page.waitForLoadState('networkidle')

  expect(page.url()).toContain('map/vessel/9827ea1ea-a120-f374-0cc6-138b38bd8130')
})

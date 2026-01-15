import { expect, test } from 'playwright/test'

test('WS01 - Save workspace', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto(
    '/map/fishing-activity/deep-sea-mining-public?zoom=1.4&latitude=-13.322088344162196&longitude=-68.31476421655266&start=2020-04-03T22%3A00%3A00.000Z&end=2021-04-03T22%3A00%3A00.000Z&dvIn[0][id]=context-layer-eez&dvIn[0][cfg][vis]=true'
  )

  // LOGIN

  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByText('Dismiss').click()

  await page.getByTestId('login-link').first().click()

  await page.waitForURL(
    'https://gateway.api.staging.globalfishingwatch.org/v3/auth?client=gfw&callback=http%3A%2F%2Flocalhost%3A3003%2Fmap%2Ffishing-activity%2Fdeep-sea-mining-public%3FcallbackUrlStorage%3Dtrue&locale=en'
  )

  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.TEST_USER_EMAIL || '')
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_USER_PASSWORD || '')

  await page.getByRole('button', { name: 'Login' }).click()

  await page.waitForURL(
    'http://localhost:3003/map/fishing-activity/deep-sea-mining-public?zoom=1.4&latitude=-13.322088344162196&longitude=-68.31476421655266&start=2020-04-03T22%3A00%3A00.000Z&end=2021-04-03T22%3A00%3A00.000Z&dvIn[0][id]=context-layer-eez&dvIn[0][cfg][vis]=true'
  )

  await page.getByLabel('Save the current workspace').click()

  await page.getByText('Save as a new workspace').click()

  expect(page.getByText('Save the current workspace')).toBeVisible()

  await page.locator('[data-test="create-workspace-name"]').fill('E2E Test Workspace')

  await page.getByText('Static (Apr 3 2020 - Apr 3 2021)').click()

  await page.getByText('Dynamic').click()

  await page.getByLabel('Days from latest data update (1-100)').clear()
  await page.getByLabel('Days from latest data update (1-100)').fill('90')

  await page.getByText('Create new workspace').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(5000) // Wait for the workspace to be saved and appear in the list

  await page.getByRole('button', { name: 'close' }).click()

  await page.getByTestId('sidebar-login-icon').click()

  await page.locator('[data-test="user-workspace"]').click()

  page.on('dialog', async (dialog) => {
    await dialog.accept()
  })

  await page.locator('[data-test="remove-workspace-button"]').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(5000) // Wait for the workspace to be removed

  expect(page.getByText('E2E Test Workspace')).not.toBeVisible()
})

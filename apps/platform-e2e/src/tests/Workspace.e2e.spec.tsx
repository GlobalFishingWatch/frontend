import { expect, test } from '../fixtures'
import { appPath } from '../paths'

test('WS01 - Save workspace', async ({ page, loginPage }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto(
    appPath(
      '/map/fishing-activity/deep-sea-mining-public?zoom=1.4&latitude=-13.322088344162196&longitude=-68.31476421655266&start=2020-04-03T22%3A00%3A00.000Z&end=2021-04-03T22%3A00%3A00.000Z&dvIn[0][id]=context-layer-eez&dvIn[0][cfg][vis]=true'
    )
  )

  // Login runs in a popup and broadcasts back, so the workspace stays loaded.
  await loginPage.login()

  await page.waitForLoadState('networkidle')

  await page.getByLabel('Save the current workspace').click()

  await page.getByText('Save as a new workspace').click()

  await expect(page.getByText('Save the current workspace')).toBeVisible()

  await page.getByTestId('create-workspace-name').fill('E2E Test Workspace')

  await expect(page.getByText('Dynamic')).toBeVisible()

  await page.getByLabel('Days from latest data update (1-100)').clear()
  await page.getByLabel('Days from latest data update (1-100)').fill('90')

  await page.getByText('Create new workspace').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(5000) // Wait for the workspace to be saved and appear in the list

  await loginPage.openUserPanel()

  await page.getByTestId('user-workspace').click()

  page.on('dialog', async (dialog) => {
    await dialog.accept()
  })

  await page.getByTestId('remove-workspace-button').first().click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(5000) // Wait for the workspace to be removed

  await expect(page.getByText('E2E Test Workspace')).not.toBeVisible()
})

import { expect, test } from 'playwright/test'

test('WS01 - Save workspace', async ({ page }) => {
  // Set a fixed time for the test
  await page.clock.setFixedTime(new Date('2026-01-07T12:00:00'))

  await page.goto(
    '/map/fishing-activity/deep-sea-mining-public?zoom=1.4&latitude=-13.322088344162196&longitude=-68.31476421655266&start=2020-04-03T22%3A00%3A00.000Z&end=2021-04-03T22%3A00%3A00.000Z&dvIn[0][id]=context-layer-eez&dvIn[0][cfg][vis]=true'
  )

  // LOGIN

  await page.getByTestId('modal-close-button').click()
  await page.waitForLoadState('networkidle')
  await page.getByText('Dismiss', { exact: true }).first().click()

  // Click the login button and wait for the auth popup window
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByText('login').click()])
  await popup.waitForLoadState()
  await popup.locator('#email').fill(process.env.TEST_USER_EMAIL || '')
  await popup.locator('#password').fill(process.env.TEST_USER_PASSWORD || '')
  await popup.getByRole('button', { name: 'Login' }).click()

  await page.getByTestId('sidebar-login-icon').click()

  //Close modal was popping up after login, so we need to close it again
  await page.getByTestId('modal-close-button').click()

  await page.getByTestId('link-workspace').click()

  await page.waitForURL('**/map/fishing-activity/deep-sea-mining-public*')

  await page.waitForLoadState('networkidle')

  await page.getByLabel('Save the current workspace').click()

  await page.getByText('Save as a new workspace').click()

  expect(page.getByText('Save the current workspace')).toBeVisible()

  await page.getByTestId('create-workspace-name').fill('E2E Test Workspace')

  await page.getByText('Static (Apr 3 2020 - Apr 3 2021)').click()

  await page.getByText('Dynamic').click()

  await page.getByLabel('Days from latest data update (1-100)').clear()
  await page.getByLabel('Days from latest data update (1-100)').fill('90')

  await page.getByText('Create new workspace').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(5000) // Wait for the workspace to be saved and appear in the list

  // nothing to close await page.getByRole('button', { name: 'close' }).click()

  await page.getByTestId('sidebar-login-icon').click()

  await page.getByTestId('user-workspace').click()

  page.on('dialog', async (dialog) => {
    await dialog.accept()
  })

  await page.getByTestId('remove-workspace-button').first().click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(5000) // Wait for the workspace to be removed

  expect(page.getByText('E2E Test Workspace')).not.toBeVisible()
})

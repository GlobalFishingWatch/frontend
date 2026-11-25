import {
  REMOVE_WORKSPACE_BUTTON_TESTID,
  USER_WORKSPACES_TAB_TESTID,
} from '@platform/config/selectors/user'
import {
  CREATE_WORKSPACE_NAME_TESTID,
  WORKSPACE_PASSWORD_INPUT_TESTID,
} from '@platform/config/selectors/workspace'

import { expect, test } from '../fixtures'
import { TIMEOUTS } from '../helpers/timeouts'
import { appPath } from '../paths'
import { TAGS } from '../tags'

// Owned by the test user (TEST_USER_EMAIL), not shared. Moved here from the platform integration
// specs: whether its owner can open it is decided by the real API, and its datasets are private,
// so it cannot be replayed from committed fixtures.
const PRIVATE_WORKSPACE_PATH = appPath(
  '/map/fishing-activity/workspace_01-user?latitude=-3.86&longitude=58.41&zoom=3.14&start=2022-01-01T00%3A00%3A00.000Z&end=2023-01-01T00%3A00%3A00.000Z'
)
// Public but password protected. It also holds a private VMS dataset, which is why it is checked
// here rather than replayed in the integration specs.
const PASSWORD_WORKSPACE_PATH = appPath(
  '/map/fishing-activity/workspace_02-user-public?latitude=-48.58&longitude=-43.78&zoom=1.8&start=2025-12-22T00%3A00%3A00.000Z&end=2026-03-22T00%3A00%3A00.000Z'
)
// Set when the workspace was created for the tests; also in the integration spec history
const WORKSPACE_02_PASSWORD = 'test1234'

test('WS01 - Save workspace', async ({ page, loginPage }) => {
  // Unique per run: the test user is shared by every CI run, and a run that is cancelled between
  // create and delete leaves its workspace behind. With a fixed name, that leftover failed the
  // final assertion on every later run, on every branch.
  const workspaceName = `E2E Test Workspace ${Date.now()}`
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

  // The save button's tooltip has the same text, so match the modal heading only
  await expect(page.getByRole('heading', { name: 'Save the current workspace' })).toBeVisible()

  await page.getByTestId(CREATE_WORKSPACE_NAME_TESTID).fill(workspaceName)

  await expect(page.getByText('Dynamic')).toBeVisible()

  await page.getByLabel('Days from latest data update (1-100)').clear()
  await page.getByLabel('Days from latest data update (1-100)').fill('90')

  await page.getByText('Create new workspace').click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(5000) // Wait for the workspace to be saved and appear in the list

  await loginPage.openUserPanel()

  await page.getByTestId(USER_WORKSPACES_TAB_TESTID).click()

  const workspaceRow = page.getByRole('listitem').filter({ hasText: workspaceName })
  await expect(workspaceRow).toBeVisible()

  page.on('dialog', async (dialog) => {
    await dialog.accept()
  })

  await workspaceRow.getByTestId(REMOVE_WORKSPACE_BUTTON_TESTID).click()

  await page.waitForLoadState('networkidle')

  await page.waitForTimeout(TIMEOUTS.SHORT) // Wait for the workspace to be removed

  await expect(page.getByText(workspaceName)).not.toBeVisible()
})

test(
  'WS02 - a private workspace opens for its owner',
  { tag: [TAGS.EXTENDED] },
  async ({ page, loginPage }) => {
    await page.goto(PRIVATE_WORKSPACE_PATH)
    // Logged out, the API refuses it
    await expect(page.getByText(/This is a private workspace/)).toBeVisible({
      timeout: TIMEOUTS.LONG,
    })

    await loginPage.login()

    await expect(page.getByText(/Workspace01/).first()).toBeVisible({ timeout: TIMEOUTS.LONG })
  }
)

test(
  'WS03 - a password-protected workspace opens with the right password',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    await page.goto(PASSWORD_WORKSPACE_PATH)

    const passwordInput = page.getByTestId(WORKSPACE_PASSWORD_INPUT_TESTID)
    await expect(passwordInput).toBeVisible({ timeout: TIMEOUTS.LONG })
    await passwordInput.fill(WORKSPACE_02_PASSWORD)
    await page.getByText('Send', { exact: true }).click()

    await expect(page.getByText(/Workspace02/).first()).toBeVisible({ timeout: TIMEOUTS.LONG })
  }
)

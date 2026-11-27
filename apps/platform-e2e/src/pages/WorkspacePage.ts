import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import {
  REMOVE_WORKSPACE_BUTTON_TESTID,
  USER_WORKSPACES_TAB_TESTID,
} from '@platform/config/selectors/user'
import {
  CREATE_WORKSPACE_NAME_TESTID,
  WORKSPACE_PASSWORD_INPUT_TESTID,
} from '@platform/config/selectors/workspace'

import { TIMEOUTS } from '../helpers/timeouts'
import { appPath } from '../paths'

const SAVE_WORKSPACE_LABEL = 'Save the current workspace'
const DAYS_FROM_LATEST_UPDATE_LABEL = 'Days from latest data update (1-100)'

export const DEEP_SEA_MINING_WORKSPACE_PATH = appPath(
  '/map/fishing-activity/deep-sea-mining-public?zoom=1.4&latitude=-13.322088344162196&longitude=-68.31476421655266&start=2020-04-03T22%3A00%3A00.000Z&end=2021-04-03T22%3A00%3A00.000Z&dvIn[0][id]=context-layer-eez&dvIn[0][cfg][vis]=true'
)
// Owned by the test user (TEST_USER_EMAIL), not shared. Moved here from the platform integration
// specs: whether its owner can open it is decided by the real API, and its datasets are private,
// so it cannot be replayed from committed fixtures.
export const PRIVATE_WORKSPACE_PATH = appPath(
  '/map/fishing-activity/workspace_01-user?latitude=-3.86&longitude=58.41&zoom=3.14&start=2022-01-01T00%3A00%3A00.000Z&end=2023-01-01T00%3A00%3A00.000Z'
)
// Public but password protected. It also holds a private VMS dataset, which is why it is checked
// here rather than replayed in the integration specs.
export const PASSWORD_WORKSPACE_PATH = appPath(
  '/map/fishing-activity/workspace_02-user-public?latitude=-48.58&longitude=-43.78&zoom=1.8&start=2025-12-22T00%3A00%3A00.000Z&end=2026-03-22T00%3A00%3A00.000Z'
)
// Set when the workspace was created for the tests; also in the integration spec history
export const WORKSPACE_02_PASSWORD = 'test1234'

export class WorkspacePage {
  private page: Page
  readonly saveWorkspaceButton: Locator
  readonly saveAsNewWorkspaceOption: Locator
  readonly saveWorkspaceHeading: Locator
  readonly workspaceNameInput: Locator
  readonly dynamicTimeRangeOption: Locator
  readonly daysFromLatestUpdateInput: Locator
  readonly createWorkspaceButton: Locator
  readonly userWorkspacesTab: Locator
  readonly privateWorkspaceMessage: Locator
  readonly passwordInput: Locator
  readonly passwordSendButton: Locator

  constructor(page: Page) {
    this.page = page
    this.saveWorkspaceButton = page.getByLabel(SAVE_WORKSPACE_LABEL)
    this.saveAsNewWorkspaceOption = page.getByText('Save as a new workspace')
    this.saveWorkspaceHeading = page.getByRole('heading', { name: SAVE_WORKSPACE_LABEL })
    this.workspaceNameInput = page.getByTestId(CREATE_WORKSPACE_NAME_TESTID)
    this.dynamicTimeRangeOption = page.getByText('Dynamic')
    this.daysFromLatestUpdateInput = page.getByLabel(DAYS_FROM_LATEST_UPDATE_LABEL)
    this.createWorkspaceButton = page.getByText('Create new workspace')
    this.userWorkspacesTab = page.getByTestId(USER_WORKSPACES_TAB_TESTID)
    this.privateWorkspaceMessage = page.getByText(/This is a private workspace/)
    this.passwordInput = page.getByTestId(WORKSPACE_PASSWORD_INPUT_TESTID)
    this.passwordSendButton = page.getByText('Send', { exact: true })
  }

  private userWorkspaceRow(name: string) {
    return this.page.getByRole('listitem').filter({ hasText: name })
  }

  async setFixedTime(time: Date) {
    await this.page.clock.setFixedTime(time)
  }

  async open(path: string) {
    await this.page.goto(path)
  }

  async saveAsNewWorkspace(
    name: string,
    { daysFromLatestUpdate }: { daysFromLatestUpdate: string }
  ) {
    await this.page.waitForLoadState('networkidle')

    await this.saveWorkspaceButton.click()
    await this.saveAsNewWorkspaceOption.click()
    await expect(this.saveWorkspaceHeading).toBeVisible()

    await this.workspaceNameInput.fill(name)

    await expect(this.dynamicTimeRangeOption).toBeVisible()

    await this.daysFromLatestUpdateInput.clear()
    await this.daysFromLatestUpdateInput.fill(daysFromLatestUpdate)

    await this.createWorkspaceButton.click()

    await this.page.waitForLoadState('networkidle')

    await this.page.waitForTimeout(TIMEOUTS.SHORT)
  }

  /** Needs the user panel open */
  async openUserWorkspaces() {
    await this.userWorkspacesTab.click()
  }

  async expectUserWorkspaceVisible(name: string) {
    await expect(this.userWorkspaceRow(name)).toBeVisible()
  }

  async removeUserWorkspace(name: string) {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept()
    })

    await this.userWorkspaceRow(name).getByTestId(REMOVE_WORKSPACE_BUTTON_TESTID).click()

    await this.page.waitForLoadState('networkidle')

    await this.page.waitForTimeout(TIMEOUTS.SHORT)
  }

  async expectWorkspaceNotVisible(name: string) {
    await expect(this.page.getByText(name)).not.toBeVisible()
  }

  async expectPrivateWorkspaceMessage() {
    await expect(this.privateWorkspaceMessage).toBeVisible({ timeout: TIMEOUTS.LONG })
  }

  async expectWorkspaceTitleVisible(pattern: RegExp) {
    await expect(this.page.getByText(pattern).first()).toBeVisible({ timeout: TIMEOUTS.LONG })
  }

  async unlockWithPassword(password: string) {
    await expect(this.passwordInput).toBeVisible({ timeout: TIMEOUTS.LONG })
    await this.passwordInput.fill(password)
    await this.passwordSendButton.click()
  }
}

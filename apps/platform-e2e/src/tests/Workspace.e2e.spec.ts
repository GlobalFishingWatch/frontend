import { test } from '../fixtures'
import {
  DEEP_SEA_MINING_WORKSPACE_PATH,
  PASSWORD_WORKSPACE_PATH,
  PRIVATE_WORKSPACE_PATH,
  WORKSPACE_02_PASSWORD,
} from '../pages/WorkspacePage'
import { TAGS } from '../tags'

test('WS01 - Save workspace', async ({ loginPage, workspacePage }) => {
  const workspaceName = `E2E Test Workspace ${Date.now()}`
  await workspacePage.setFixedTime(new Date('2026-01-07T12:00:00'))

  await workspacePage.open(DEEP_SEA_MINING_WORKSPACE_PATH)

  await loginPage.login()

  await workspacePage.saveAsNewWorkspace(workspaceName, { daysFromLatestUpdate: '90' })

  await loginPage.openUserPanel()
  await workspacePage.openUserWorkspaces()
  await workspacePage.expectUserWorkspaceVisible(workspaceName)

  await workspacePage.removeUserWorkspace(workspaceName)
  await workspacePage.expectWorkspaceNotVisible(workspaceName)
})

test(
  'WS02 - a private workspace opens for its owner',
  { tag: [TAGS.EXTENDED] },
  async ({ loginPage, workspacePage }) => {
    await workspacePage.open(PRIVATE_WORKSPACE_PATH)
    await workspacePage.expectPrivateWorkspaceMessage()

    await loginPage.login()

    await workspacePage.expectWorkspaceTitleVisible(/Private Brazil/)
  }
)

test(
  'WS03 - a password-protected workspace opens with the right password',
  { tag: [TAGS.EXTENDED] },
  async ({ workspacePage }) => {
    await workspacePage.open(PASSWORD_WORKSPACE_PATH)

    await workspacePage.unlockWithPassword(WORKSPACE_02_PASSWORD)

    await workspacePage.expectWorkspaceTitleVisible(/Workspace02/)
  }
)

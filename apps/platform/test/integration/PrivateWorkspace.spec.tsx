import { render } from 'test/appTestUtils'
import { navigateToWorkspace01 } from 'test/utils/navigation/navigateToWorkspace01'
import { navigateToWorkspace02 } from 'test/utils/navigation/navigateToWorkspace02'
import { defaultState } from 'test/utils/store'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { WORKSPACE_PASSWORD_INPUT_TESTID } from '@platform/config/selectors/workspace'

import { makeStore } from 'store'

describe('PrivateWorkspace', async () => {
  it('should not be able to navigate to the private workspace if not authenticated', async () => {
    const store = makeStore(defaultState)

    const { getByText, router } = await render({ store })
    await router.navigate(navigateToWorkspace01())

    await expect.element(getByText(/Workspace01/)).not.toBeInTheDocument()
    await expect.element(getByText(/This is a private workspace/)).toBeVisible()
  })

  // Opening it as its owner is checked in apps/platform-e2e (Workspace.e2e.spec.ts, WS02): the
  // grant is decided by the real API and the workspace's datasets are private, so it cannot be
  // replayed from committed fixtures. The real password check also lives there (WS03).

  it('should be able to navigate to a password-protected workspace if correct password is used', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, getByText, router } = await render({ store })
    await router.navigate(navigateToWorkspace02())

    await expect.element(getByTestId(WORKSPACE_PASSWORD_INPUT_TESTID)).toBeVisible()

    await userEvent.type(getByTestId(WORKSPACE_PASSWORD_INPUT_TESTID), 'test1234')

    await userEvent.click(getByText('Send'))

    await expect.element(getByText(/Workspace02/)).toBeVisible()
  })

  it('should not be able to navigate to a password-protected workspace if incorrect password is used', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, getByText, router } = await render({ store })
    await router.navigate(navigateToWorkspace02())

    await expect.element(getByTestId(WORKSPACE_PASSWORD_INPUT_TESTID)).toBeVisible()

    await userEvent.type(getByTestId(WORKSPACE_PASSWORD_INPUT_TESTID), 'wrongpassword')

    await userEvent.click(getByText('Send'))

    await expect.element(getByText(/Invalid password/)).toBeVisible()
  })
})

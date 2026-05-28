import { render } from 'test/appTestUtils'
import { navigateToWorkspace01 } from 'test/utils/navigation/navigateToWorkspace01'
import { navigateToWorkspace02 } from 'test/utils/navigation/navigateToWorkspace02'
import { defaultState } from 'test/utils/store'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { makeStore } from 'store'

describe('PrivateWorkspace', async () => {
  it('should not be able to navigate to the private workspace if not authenticated', async () => {
    const store = makeStore(defaultState)

    const { getByText, router } = await render({ store })
    await router.navigate(navigateToWorkspace01())

    await expect.element(getByText(/Workspace01/)).not.toBeInTheDocument()
    await expect.element(getByText(/This is a private workspace/)).toBeVisible()
  })

  it('should be able to navigate to the private workspace if authenticated', async () => {
    const store = makeStore(defaultState)

    const { getByText, router } = await render({ store, authenticated: true })
    await router.navigate(navigateToWorkspace01())

    await expect.element(getByText(/Workspace01/)).toBeVisible()
  })

  it('should be able to navigate to a password-protected workspace if correct password is used', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, getByText, router } = await render({ store })
    await router.navigate(navigateToWorkspace02())

    await expect.element(getByTestId('create-workspace-password')).toBeVisible()

    await userEvent.type(getByTestId('create-workspace-password'), 'test1234')

    await userEvent.click(getByText('Send'))

    await expect.element(getByText(/Workspace02/)).toBeVisible()
  })

  it('should not be able to navigate to a password-protected workspace if incorrect password is used', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, getByText, router } = await render({ store })
    await router.navigate(navigateToWorkspace02())

    await expect.element(getByTestId('create-workspace-password')).toBeVisible()

    await userEvent.type(getByTestId('create-workspace-password'), 'wrongpassword')

    await userEvent.click(getByText('Send'))

    await expect.element(getByText(/Invalid password/)).toBeVisible()
  })
})

import { render } from 'test/appTestUtils'
import { navigateToWorkspace01Action } from 'test/utils/actions/navigateToWorkspace01'
import { navigateToWorkspace02Action } from 'test/utils/actions/navigateToWorkspace02'
import { defaultState } from 'test/utils/store/redux-store-test'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('PrivateWorkspace', async () => {
  it('should not be able to navigate to the private workspace if not authenticated', async () => {
    const store = makeStore(defaultState, [], true)

    store.dispatch(navigateToWorkspace01Action)

    const { getByTestId } = await render(<App />, { store })

    await expect.element(getByTestId('login-link')).toBeVisible()
  })

  it('should be able to navigate to the private workspace if authenticated', async () => {
    const store = makeStore(defaultState, [], true)

    store.dispatch(navigateToWorkspace01Action)

    const { getByText } = await render(<App />, { store, authenticated: true })

    await expect.element(getByText(/Workspace01/)).toBeVisible()
  })

  it('should be able to navigate to a password-protected workspace if correct password is used', async () => {
    const store = makeStore(defaultState, [], true)

    store.dispatch(navigateToWorkspace02Action)

    const { getByTestId, getByText } = await render(<App />, { store })

    await expect.element(getByTestId('create-workspace-password')).toBeVisible()

    await userEvent.type(getByTestId('create-workspace-password'), 'test1234')

    await userEvent.click(getByText('Send'))

    await expect.element(getByText(/Workspace02/)).toBeVisible()
  })

  it('should not be able to navigate to a password-protected workspace if incorrect password is used', async () => {
    const store = makeStore(defaultState, [], true)

    store.dispatch(navigateToWorkspace02Action)

    const { getByTestId, getByText } = await render(<App />, { store })

    await expect.element(getByTestId('create-workspace-password')).toBeVisible()

    await userEvent.type(getByTestId('create-workspace-password'), 'wrongpassword')

    await userEvent.click(getByText('Send'))

    await expect.element(getByText(/Invalid password/)).toBeVisible()
  })
})

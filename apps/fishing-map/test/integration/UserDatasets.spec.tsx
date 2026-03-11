import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('User Datasets', () => {
  it('should show login prompt when user is not logged in', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText, getByRole } = await render(<App />, { store })
    const openLayerModalButton = getByTestId('activity-add-layer-button')

    await openLayerModalButton.click()

    await userEvent.click(getByRole('button', { name: 'User' }))

    expect(
      getByRole('dialog').getByText('Register or login to upload datasets (free, 2 minutes)')
    ).toBeVisible()

    await expect.element(getByRole('dialog').getByTestId('login-link').last()).toBeVisible()
  })

  it('should show user dataset sections when user is logged in', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId, getByText, getByRole } = await render(<App />, {
      store,
      authenticated: true,
    })

    const openLayerModalButton = getByTestId('activity-add-layer-button')

    await openLayerModalButton.click()

    await userEvent.click(getByRole('button', { name: 'User' }))

    await expect.element(getByText('Tracks')).toBeVisible()
    await expect.element(getByText('Polygons')).toBeVisible()
    await expect.element(getByText('Points')).toBeVisible()
    await expect.element(getByText('Bigquery')).toBeVisible()
  })
})

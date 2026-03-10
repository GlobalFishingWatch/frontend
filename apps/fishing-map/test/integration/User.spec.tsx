import React from 'react'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Help hints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  // TODO: improve this to really detect a logout event
  it('should show expired session warning toast', async () => {
    const store = makeStore(defaultState, [], true)
    store.dispatch(setLoginExpired(true))

    const { getByText, getByTestId } = await render(<App />, { store })

    await expect.element(getByText(/Your session has expired/i)).toBeVisible()
    await expect.element(getByTestId('login-link').first()).toBeVisible()
  })
})

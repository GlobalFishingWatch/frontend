import React from 'react'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/utils/store/redux-store-test'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setLoginExpired } from 'features/user/user.slice'
import { makeStore } from 'store'

describe('User expiration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  // TODO: improve this to really detect a logout event
  it('should show expired session warning toast', async () => {
    const store = makeStore(defaultState)
    store.dispatch(setLoginExpired(true))

    const { getByText, getByTestId } = await render({ store })

    await expect.element(getByText(/Your session has expired/i)).toBeVisible()
    await expect.element(getByTestId('login-link').first()).toBeVisible()
  })
})

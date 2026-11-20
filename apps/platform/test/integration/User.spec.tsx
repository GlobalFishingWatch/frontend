import { render } from 'test/appTestUtils'
import { defaultState } from 'test/utils/store'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setLoginExpired } from 'features/_user/user.slice'
import { makeStore } from 'store'

describe('User expiration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  // TODO: improve this to really detect a logout event
  it('should show expired session warning toast', async () => {
    const store = makeStore(defaultState)

    const { getByText, getByTestId } = await render({ store })

    // useInitAppStore dispatches setLoggedUser while the platform layout first renders, and that
    // resets `expired` to false, so the flag has to be set after it. The root loader is async, so
    // render() can resolve before that layout renders. The workspace (which hosts the toast) is a
    // child of that layout, so once its sidebar is on screen the boot dispatch has run.
    await expect.element(getByTestId('user-section')).toBeInTheDocument()
    store.dispatch(setLoginExpired(true))

    await expect.element(getByText(/Your session has expired/i)).toBeVisible()
    await expect.element(getByTestId('login-link').first()).toBeVisible()
  })
})

import { render, withGuestUser } from 'test/appTestUtils'
import { describe, expect, it } from 'vitest'

import { makeStore } from 'store'

describe('UserSection', () => {
  it('should have a login link if the user is a guest', async () => {
    const store = await withGuestUser(makeStore())

    const { getByTestId } = await render({ store })

    expect(store.getState().user.data?.type === 'guest').toBe(true)

    // The header's upload/draw buttons also render a `login-link` for guests; the empty-state one
    // is the only link with visible text.
    const loginLink = getByTestId('user-section')
      .getByTestId('login-link')
      .filter({ hasText: 'login' })
    await expect.element(loginLink).toBeInTheDocument()
  })
})

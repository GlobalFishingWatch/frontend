import { render, withGuestUser } from 'test/appTestUtils'
import { describe, expect, it } from 'vitest'

import { makeStore } from 'store'

import UserSection from './UserSection'

describe('UserSection', () => {
  it('should have a login link if the user is a guest', async () => {
    const store = await withGuestUser(makeStore())

    const { getByText } = await render(<UserSection />, { store })

    expect(store.getState().user.data?.type === 'guest').toBe(true)

    await expect.element(getByText('Register')).toBeInTheDocument()
  })
})

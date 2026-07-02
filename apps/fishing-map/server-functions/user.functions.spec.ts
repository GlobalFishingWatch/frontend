import { afterEach, describe, expect, it, vi } from 'vitest'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'

// Initializes i18next — the shared vitest.setup.ts calls i18n.changeLanguage in beforeAll
// and expects app imports to have set it up.
import 'features/i18n/i18n'

import { resolveUserStateFromCookies } from './user.functions'

// The gateway revokes ALL of a user's tokens when a rotated refresh token is presented
// again (no grace window), so SSR must NEVER refresh tokens: parallel document requests
// carrying the same refresh cookie would log the user out everywhere. These tests pin
// that contract — an expired/missing access token with a live refresh cookie yields a
// pending session (user: null) for the client to resolve, with no server-side reload.

const USER = { id: 49, type: 'user', permissions: [], groups: [] } as unknown as UserData

afterEach(() => {
  vi.restoreAllMocks()
})

describe('resolveUserStateFromCookies', () => {
  it('resolves the user with a valid access token without reloading tokens', async () => {
    const fetchUser = vi.spyOn(GFWAPI, 'fetchUser').mockResolvedValue(USER)
    const reloadTokens = vi.spyOn(GFWAPI, 'reloadTokens')

    const { user } = await resolveUserStateFromCookies(
      `${USER_TOKEN_COOKIE_KEY}=valid-token; ${USER_REFRESH_TOKEN_COOKIE_KEY}=refresh-token`
    )

    expect(user).toEqual(USER)
    expect(fetchUser).toHaveBeenCalledWith(expect.objectContaining({ token: 'valid-token' }))
    expect(reloadTokens).not.toHaveBeenCalled()
  })

  it('returns a pending session (user: null) when the access token is rejected but a refresh cookie exists — never refreshing server-side', async () => {
    vi.spyOn(GFWAPI, 'fetchUser').mockRejectedValue(
      Object.assign(new Error('401'), { status: 401 })
    )
    const reloadTokens = vi.spyOn(GFWAPI, 'reloadTokens')

    const { user } = await resolveUserStateFromCookies(
      `${USER_TOKEN_COOKIE_KEY}=expired-token; ${USER_REFRESH_TOKEN_COOKIE_KEY}=refresh-token`
    )

    expect(user).toBeNull()
    // The critical assertion: no token rotation during SSR
    expect(reloadTokens).not.toHaveBeenCalled()
  })

  it('returns a pending session when there is no access token but a refresh cookie exists', async () => {
    const fetchUser = vi.spyOn(GFWAPI, 'fetchUser')
    const reloadTokens = vi.spyOn(GFWAPI, 'reloadTokens')

    const { user } = await resolveUserStateFromCookies(
      `${USER_REFRESH_TOKEN_COOKIE_KEY}=refresh-token`
    )

    expect(user).toBeNull()
    expect(fetchUser).not.toHaveBeenCalled()
    expect(reloadTokens).not.toHaveBeenCalled()
  })

  it('falls back to the guest user when no auth cookies are present', async () => {
    const reloadTokens = vi.spyOn(GFWAPI, 'reloadTokens')

    const { user } = await resolveUserStateFromCookies('')

    expect(user?.type).toBe('guest')
    expect(reloadTokens).not.toHaveBeenCalled()
  })
})

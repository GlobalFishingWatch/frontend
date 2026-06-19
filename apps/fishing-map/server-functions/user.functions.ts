import { createServerFn } from '@tanstack/react-start'

import { getGuestUser, GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { clearAuthCookies, refreshAuthTokens } from 'server-functions/auth.functions'

export const getUserState = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ user: UserData | null }> => {
    const { getCookie, setCookie } = await import('@tanstack/react-start/server')
    const token = getCookie(USER_TOKEN_COOKIE_KEY)
    console.log('[DEBUG getUserState] start, hasToken:', Boolean(token))

    // Try the access token if present.
    if (token) {
      try {
        const user = await GFWAPI.fetchUser({ token })
        console.log('[DEBUG getUserState] token path OK, userId:', user?.id, 'type:', user?.type)
        return { user }
      } catch (e) {
        console.log('[DEBUG getUserState] token path FAILED:', (e as Error)?.message)
        // Expired/invalid — fall through to a refresh attempt.
      }
    }

    // Refresh via the httpOnly refresh cookie (reuses auth.functions). Falls back to the
    // guest user when there is no refresh cookie (throws 401) or the refresh is dead.
    try {
      const tokens = await refreshAuthTokens(getCookie, setCookie)
      const user = await GFWAPI.fetchUser({ token: tokens.token })
      console.log('[DEBUG getUserState] refresh path OK, userId:', user?.id, 'type:', user?.type)
      return { user }
    } catch (e) {
      console.log('[DEBUG getUserState] refresh path FAILED, returning guest:', (e as Error)?.message)
      clearAuthCookies(setCookie)
      return { user: getGuestUser() }
    }
  }
)

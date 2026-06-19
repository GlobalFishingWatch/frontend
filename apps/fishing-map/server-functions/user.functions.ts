import { createServerFn } from '@tanstack/react-start'

import { getGuestUser, GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { clearAuthCookies, refreshAuthTokens } from 'server-functions/auth.functions'

export const getUserState = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ user: UserData | null }> => {
    const { getCookie, setCookie } = await import('@tanstack/react-start/server')
    const token = getCookie(USER_TOKEN_COOKIE_KEY)

    // Try the access token if present.
    if (token) {
      try {
        const user = await GFWAPI.fetchUser({ token })
        return { user }
      } catch (e) {
        // Expired/invalid — fall through to a refresh attempt.
      }
    }

    // Refresh via the httpOnly refresh cookie (reuses auth.functions). Falls back to the
    // guest user when there is no refresh cookie (throws 401) or the refresh is dead.
    try {
      const tokens = await refreshAuthTokens(getCookie, setCookie)
      const user = await GFWAPI.fetchUser({ token: tokens.token })
      return { user }
    } catch (e) {
      clearAuthCookies(setCookie)
      return { user: getGuestUser() }
    }
  }
)

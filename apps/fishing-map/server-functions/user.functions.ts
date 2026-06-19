import { getGuestUser, GFWAPI, readCookieString } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { clearAuthCookies, refreshAuthTokens } from 'server-functions/auth.functions'

export async function resolveUserState(request: Request): Promise<{ user: UserData | null }> {
  const { setCookie } = await import('@tanstack/react-start/server')
  const cookieHeader = request.headers.get('cookie') ?? ''
  const token = readCookieString(cookieHeader, USER_TOKEN_COOKIE_KEY)

  // Try the access token if present.
  if (token) {
    try {
      const user = await GFWAPI.fetchUser({ token })
      return { user }
    } catch (e) {
      // Expired/invalid — fall through to a refresh attempt.
    }
  }

  // Refresh via the refresh cookie. Falls back to the guest user when there is no refresh
  // cookie (throws 401) or the refresh is dead.
  try {
    const refreshToken = readCookieString(cookieHeader, USER_REFRESH_TOKEN_COOKIE_KEY)
    const tokens = await refreshAuthTokens(refreshToken ?? undefined, setCookie)
    const user = await GFWAPI.fetchUser({ token: tokens.token })
    return { user }
  } catch (e) {
    clearAuthCookies(setCookie)
    return { user: getGuestUser() }
  }
}

export async function resolveUserStateFromRequest(): Promise<{ user: UserData | null }> {
  const { getRequest } = await import('@tanstack/react-start/server')
  return resolveUserState(getRequest())
}

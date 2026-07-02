import { getGuestUser, GFWAPI, readCookieString } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { SSR_HEADERS } from 'server-functions/auth.functions'

export async function resolveUserStateFromRequest(): Promise<{ user: UserData | null }> {
  const { getRequest } = await import('@tanstack/react-start/server')
  return resolveUserStateFromCookies(getRequest().headers.get('cookie') ?? '')
}

// Pure resolution from the cookie header. Deliberately has no way to set or clear cookies
// and never calls the token-reload endpoint — see the comment below.
export async function resolveUserStateFromCookies(
  cookieHeader: string
): Promise<{ user: UserData | null }> {
  const token = readCookieString(cookieHeader, USER_TOKEN_COOKIE_KEY)

  // Try the access token if present.
  if (token) {
    try {
      const user = await GFWAPI.fetchUser({
        token,
        headers: SSR_HEADERS,
      })
      return { user }
    } catch (e) {
      // Expired/invalid — fall through to the pending state below.
    }
  }

  // NEVER refresh during SSR: concurrent document requests (tab restore, multi-tab open)
  // all carry the same refresh cookie, and the gateway revokes ALL the user's tokens when
  // a rotated refresh token is presented again — no grace window. With a refresh cookie
  // present, return a pending session (user: null) and let the hydrated client perform the
  // single refresh, which api-client serializes via navigator.locks + in-flight dedup.
  // Don't clear cookies either: an expired access token with a live refresh token is the
  // normal expiry case, not a broken session.
  const refreshToken = readCookieString(cookieHeader, USER_REFRESH_TOKEN_COOKIE_KEY)
  if (refreshToken) {
    return { user: null }
  }
  return { user: getGuestUser() }
}

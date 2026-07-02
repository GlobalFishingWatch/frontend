import { createHash } from 'node:crypto'

import { getGuestUser, GFWAPI, readCookieString } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import {
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_SESSION_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from 'features/app/app.config'
import { createSessionRecord, getSessionStore } from 'server/session'
import {
  clearAuthCookies,
  refreshSessionTokens,
  setAccessTokenCookie,
  setSessionCookie,
  SSR_HEADERS,
} from 'server-functions/auth.functions'

/**
 * Migrates a pre-session-store login: the refresh token used to live in an httpOnly
 * cookie. The sid is derived deterministically from the refresh token so N tabs
 * racing the migration all converge on the SAME session doc (createIfAbsent keeps the
 * first write). No gateway call happens here — the first real rotation runs under the
 * session lock. TODO: remove one release cycle after deploy; stragglers just re-login.
 */
async function migrateLegacySession(
  refreshToken: string,
  token: string | null,
  setCookie: (key: string, value: string, options?: Record<string, unknown>) => void
): Promise<string> {
  const sid = createHash('sha256').update(refreshToken).digest('base64url').slice(0, 32)
  const store = await getSessionStore()
  await store.createIfAbsent(sid, createSessionRecord({ token: token ?? '', refreshToken }, 0))
  setSessionCookie(setCookie, sid)
  return sid
}

export async function resolveUserStateFromRequest(): Promise<{ user: UserData | null }> {
  const { getRequest, setCookie } = await import('@tanstack/react-start/server')
  const cookieHeader = getRequest().headers.get('cookie') ?? ''
  const token = readCookieString(cookieHeader, USER_TOKEN_COOKIE_KEY)
  let sid = readCookieString(cookieHeader, USER_SESSION_COOKIE_KEY)

  if (!sid) {
    const legacyRefreshToken = readCookieString(cookieHeader, USER_REFRESH_TOKEN_COOKIE_KEY)
    if (legacyRefreshToken) {
      try {
        sid = await migrateLegacySession(legacyRefreshToken, token, setCookie)
        console.log('GFW session: migrated legacy cookie session', sid.slice(0, 8))
      } catch (e) {
        // A store failure must not break SSR — render as guest, keep cookies for retry
        console.warn('GFW session: legacy migration failed', e)
      }
    }
  }

  // Try the access token if present.
  if (token) {
    try {
      const user = await GFWAPI.fetchUser({
        token,
        headers: SSR_HEADERS,
      })
      return { user }
    } catch {
      // Expired/invalid — fall through to a session refresh.
    }
  }

  if (!sid) {
    // Not logged in: no cookie writes on anonymous requests
    if (token) clearAuthCookies(setCookie)
    return { user: getGuestUser() }
  }

  // Refresh through the session store — serialized across tabs/requests/instances,
  // so concurrent SSR document loads can no longer replay a rotated refresh token.
  try {
    const { token: freshToken } = await refreshSessionTokens(sid, token ?? undefined)
    setAccessTokenCookie(setCookie, freshToken)
    const user = await GFWAPI.fetchUser({
      token: freshToken,
      headers: SSR_HEADERS,
    })
    return { user }
  } catch (e) {
    // Only a dead session (401) clears cookies; transient gateway/store failures render
    // as guest for this request and the session recovers on the next one.
    if ((e as { status?: number }).status === 401) {
      console.warn('GFW session: dead session on SSR, clearing cookies', (e as Error).message)
      clearAuthCookies(setCookie)
    } else {
      console.warn('GFW session: transient SSR refresh failure', (e as Error).message)
    }
    return { user: getGuestUser() }
  }
}

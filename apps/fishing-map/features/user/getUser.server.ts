import { GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { readRequestCookieString } from 'utils/cookies'

// Server-only: resolves the logged-in user during SSR by reading the access
// token from the request's Cookie header (NOT the GFWAPI singleton, whose token
// getter is client-only and whose state would leak across concurrent requests).
export async function fetchUserFromRequest(request: Request): Promise<UserData | null> {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null

  const token = readRequestCookieString(cookieHeader, USER_TOKEN_COOKIE_KEY)
  if (!token) return null

  try {
    const url = GFWAPI.generateUrl(`/auth/me`, { absolute: true })
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return null
    return (await response.json()) as UserData
  } catch (e) {
    // A bad/expired cookie token must not break SSR — fall back to the client,
    // which will re-resolve the user (and refresh the token) after hydration.
    console.warn('SSR user resolution failed', e)
    return null
  }
}

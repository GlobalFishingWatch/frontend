import { getGuestUser, GFWAPI, readCookieString } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import {
  SSR_HEADERS,
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from 'features/app/app.config'
import { clearAuthCookies, refreshAuthTokens } from 'server/auth.server'

type UserState = { user: UserData | null }

const userStateByRequest = new WeakMap<Request, Promise<UserState>>()

export async function resolveUserStateFromRequest(): Promise<UserState> {
  const { getRequest } = await import('@tanstack/react-start/server')
  const request = getRequest()
  let userState = userStateByRequest.get(request)
  if (!userState) {
    userState = fetchUserStateFromRequest(request)
    userStateByRequest.set(request, userState)
  }
  return userState
}

async function fetchUserStateFromRequest(request: Request): Promise<UserState> {
  const { setCookie } = await import('@tanstack/react-start/server')
  const cookieHeader = request.headers.get('cookie') ?? ''
  const token = readCookieString(cookieHeader, USER_TOKEN_COOKIE_KEY)

  // Try the access token if present.
  if (token) {
    try {
      const user = await GFWAPI.fetchUser({
        token,
        headers: SSR_HEADERS,
      })
      return { user }
    } catch {
      // Expired/invalid — fall through to a refresh attempt.
    }
  }

  // Refresh via the refresh cookie. Falls back to the guest user when there is no refresh
  // cookie (throws 401) or the refresh is dead.
  try {
    const refreshToken = readCookieString(cookieHeader, USER_REFRESH_TOKEN_COOKIE_KEY)
    const tokens = await refreshAuthTokens(refreshToken ?? undefined, setCookie)
    const user = await GFWAPI.fetchUser({
      token: tokens.token,
      headers: SSR_HEADERS,
    })
    return { user }
  } catch {
    clearAuthCookies(setCookie)
    return { user: getGuestUser() }
  }
}

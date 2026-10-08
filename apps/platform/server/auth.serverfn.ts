import { createServerFn } from '@tanstack/react-start'

import { getIsUnauthorizedError, GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { SSR_HEADERS, USER_REFRESH_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import type { Tokens } from 'server/auth.server'
import { clearAuthCookies, refreshAuthTokens, setAuthCookies } from 'server/auth.server'

export const loginServerFn = createServerFn({ method: 'POST' })
  .validator((data: { accessToken?: string | null }) => data)
  .handler(async ({ data }): Promise<UserData | null> => {
    if (!data.accessToken) return null
    const { setCookie } = await import('@tanstack/react-start/server')
    try {
      const tokens = await GFWAPI.exchangeAccessToken(data.accessToken, SSR_HEADERS)
      setAuthCookies(setCookie, tokens)
      return GFWAPI.fetchUser({ token: tokens.token, headers: SSR_HEADERS })
    } catch (e) {
      console.error('Failed to exchange access token', e)
      throw e
    }
  })

export const refreshTokenServerFn = createServerFn({ method: 'POST' }).handler(
  async (): Promise<Tokens> => {
    const { getCookie, setCookie } = await import('@tanstack/react-start/server')
    return refreshAuthTokens(getCookie(USER_REFRESH_TOKEN_COOKIE_KEY), setCookie)
  }
)

export const clearAuthCookiesServerFn = createServerFn({ method: 'POST' }).handler(
  async (): Promise<boolean> => {
    const { setCookie } = await import('@tanstack/react-start/server')
    clearAuthCookies(setCookie)
    return true
  }
)

export const logoutServerFn = createServerFn({ method: 'POST' }).handler(
  async (): Promise<boolean> => {
    const { getCookie, setCookie } = await import('@tanstack/react-start/server')
    const refreshToken = getCookie(USER_REFRESH_TOKEN_COOKIE_KEY)
    try {
      if (refreshToken) {
        await GFWAPI.revokeRefreshToken(refreshToken, SSR_HEADERS)
      }
    } catch (e) {
      // 401 means the refresh token is already invalid/revoked on the gateway — the
      // local session is still cleared below. Only warn on unexpected failures.
      if (!getIsUnauthorizedError(e as { status?: number })) {
        console.warn('Logout gateway call failed', e)
      }
    } finally {
      clearAuthCookies(setCookie)
    }
    return true
  }
)

import { createServerFn } from '@tanstack/react-start'

import { getIsUnauthorizedError, GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'

export type Tokens = { token: string; refreshToken: string }
export type CookieSetter = (key: string, value: string, options?: Record<string, unknown>) => void
type CookieGetter = (key: string) => string | undefined

const COOKIE_MAX_AGE_1_YEAR = 60 * 60 * 24 * 365

const accessCookieOptions = {
  maxAge: COOKIE_MAX_AGE_1_YEAR,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}

const refreshCookieOptions = { ...accessCookieOptions, httpOnly: true }

export const setAuthCookies = (setCookie: CookieSetter, { token, refreshToken }: Tokens) => {
  setCookie(USER_TOKEN_COOKIE_KEY, token, accessCookieOptions)
  setCookie(USER_REFRESH_TOKEN_COOKIE_KEY, refreshToken, refreshCookieOptions)
}

export const clearAuthCookies = (setCookie: CookieSetter) => {
  setCookie(USER_TOKEN_COOKIE_KEY, '', { ...accessCookieOptions, maxAge: 0 })
  setCookie(USER_REFRESH_TOKEN_COOKIE_KEY, '', { ...refreshCookieOptions, maxAge: 0 })
}

export const loginServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { accessToken?: string | null }) => data)
  .handler(async ({ data }): Promise<UserData | null> => {
    if (!data.accessToken) return null
    const { setCookie } = await import('@tanstack/react-start/server')
    const tokens = await GFWAPI.exchangeAccessToken(data.accessToken)
    setAuthCookies(setCookie, tokens)
    return GFWAPI.fetchUser({ token: tokens.token })
  })

// Reads the refresh cookie, reloads tokens and persists them. Throws a 401 when there
// is no refresh cookie. Shared between the refresh RPC and SSR user resolution.
export async function refreshAuthTokens(
  getCookie: CookieGetter,
  setCookie: CookieSetter
): Promise<Tokens> {
  const refreshToken = getCookie(USER_REFRESH_TOKEN_COOKIE_KEY)
  if (!refreshToken) {
    const error = new Error('No refresh token') as Error & { status: number }
    error.status = 401
    throw error
  }
  const tokens = await GFWAPI.reloadTokens(refreshToken)
  setAuthCookies(setCookie, tokens)
  return tokens
}

export const refreshTokenServerFn = createServerFn({ method: 'POST' }).handler(
  async (): Promise<Tokens> => {
    const { getCookie, setCookie } = await import('@tanstack/react-start/server')
    return refreshAuthTokens(getCookie, setCookie)
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
        await GFWAPI.revokeRefreshToken(refreshToken)
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

import { createServerFn } from '@tanstack/react-start'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'

type Tokens = { token: string; refreshToken: string }
type CookieSetter = (key: string, value: string, options?: Record<string, unknown>) => void

const COOKIE_MAX_AGE_1_YEAR = 60 * 60 * 24 * 365

const accessCookieOptions = {
  maxAge: COOKIE_MAX_AGE_1_YEAR,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}

const refreshCookieOptions = { ...accessCookieOptions, httpOnly: true }

const setAuthCookies = (setCookie: CookieSetter, { token, refreshToken }: Tokens) => {
  setCookie(USER_TOKEN_COOKIE_KEY, token, accessCookieOptions)
  setCookie(USER_REFRESH_TOKEN_COOKIE_KEY, refreshToken, refreshCookieOptions)
}

const clearAuthCookies = (setCookie: CookieSetter) => {
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

export const refreshTokenServerFn = createServerFn({ method: 'POST' }).handler(
  async (): Promise<Tokens> => {
    const { getCookie, setCookie } = await import('@tanstack/react-start/server')
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
      console.warn('Logout gateway call failed', e)
    } finally {
      clearAuthCookies(setCookie)
    }
    return true
  }
)

import { createServerFn } from '@tanstack/react-start'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'

type Tokens = { token: string; refreshToken: string }
type CookieSetter = (key: string, value: string, options?: Record<string, unknown>) => void

const COOKIE_MAX_AGE_1_YEAR = 60 * 60 * 24 * 365

// Access token: JS-readable so the client can build Bearer headers and the server can
// read it from the request cookie. Refresh token: httpOnly so it never reaches browser
// JS (only these server functions read it). path '/' so it is sent to the server-fn
// endpoint; it stays first-party (the cross-origin gateway never receives it).
const accessCookieOptions = { path: '/', sameSite: 'lax' as const, maxAge: COOKIE_MAX_AGE_1_YEAR }
const refreshCookieOptions = { ...accessCookieOptions, httpOnly: true }

const setAuthCookies = (setCookie: CookieSetter, { token, refreshToken }: Tokens) => {
  setCookie(USER_TOKEN_COOKIE_KEY, token, accessCookieOptions)
  setCookie(USER_REFRESH_TOKEN_COOKIE_KEY, refreshToken, refreshCookieOptions)
}

const clearAuthCookies = (setCookie: CookieSetter) => {
  setCookie(USER_TOKEN_COOKIE_KEY, '', { ...accessCookieOptions, maxAge: 0 })
  setCookie(USER_REFRESH_TOKEN_COOKIE_KEY, '', { ...refreshCookieOptions, maxAge: 0 })
}

// Exchange the SSO access token for API tokens, set both cookies, and resolve the user.
// Done server-side so the refresh token is only ever written as an httpOnly cookie.
export const loginServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { accessToken?: string | null }) => data)
  .handler(async ({ data }): Promise<UserData | null> => {
    if (!data.accessToken) return null
    const { setCookie } = await import('@tanstack/react-start/server')
    const tokens = await GFWAPI.exchangeAccessToken(data.accessToken)
    console.log('🚀 ~ tokens:', tokens)
    setAuthCookies(setCookie, tokens)
    return GFWAPI.fetchUser({ token: tokens.token })
  })

// The refresh strategy injected into GFWAPI (see client.tsx). Reads the httpOnly
// refresh cookie, forwards it to the gateway, rotates both cookies, and returns the
// fresh tokens. Always reads the live cookie, so cross-tab rotation is handled here.
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

// Invalidate the session on the gateway and clear both cookies (always clears, even
// if the gateway call fails — logout intent is to drop the local session).
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

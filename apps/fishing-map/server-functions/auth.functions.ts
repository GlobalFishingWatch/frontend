import { createServerFn } from '@tanstack/react-start'

import { getIsUnauthorizedError, GFWAPI, isTransientError } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'

export type Tokens = { token: string; refreshToken: string }
export type CookieSetter = (key: string, value: string, options?: Record<string, unknown>) => void

const SSR_SUBDOMAIN_SUFFIX =
  { development: '-dev', staging: '-sta' }[import.meta.env.VITE_WORKSPACE_ENV as string] ?? ''
export const SSR_REFERER = `https://ssr${SSR_SUBDOMAIN_SUFFIX}.globalfishingwatch.org`
export const SSR_HEADERS = { referer: SSR_REFERER } as HeadersInit

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
    try {
      const tokens = await GFWAPI.exchangeAccessToken(data.accessToken, SSR_HEADERS)
      setAuthCookies(setCookie, tokens)
      return GFWAPI.fetchUser({ token: tokens.token, headers: SSR_HEADERS })
    } catch (e) {
      console.error('Failed to exchange access token', e)
      throw e
    }
  })

const MAX_TRANSIENT_RETRIES = 2

// A gateway hiccup (5xx/network) must not surface as an auth failure — downstream that
// gets classified as a dead session and logs the user out.
export async function withTransientRetry<T>(run: () => Promise<T>, retries = 0): Promise<T> {
  try {
    return await run()
  } catch (e) {
    if (
      isTransientError(e as { status?: number; message?: string }) &&
      retries < MAX_TRANSIENT_RETRIES
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (retries + 1)))
      return withTransientRetry(run, retries + 1)
    }
    throw e
  }
}

const REFRESH_GRACE_PERIOD_MS = 30_000
const sharedRefreshes = new Map<string, { promise: Promise<Tokens>; expires: number }>()

function reloadTokensShared(refreshToken: string): Promise<Tokens> {
  const now = Date.now()
  for (const [key, entry] of sharedRefreshes) {
    if (entry.expires <= now) sharedRefreshes.delete(key)
  }
  const shared = sharedRefreshes.get(refreshToken)
  if (shared) return shared.promise
  const promise = withTransientRetry(() => GFWAPI.reloadTokens(refreshToken, SSR_HEADERS))
  sharedRefreshes.set(refreshToken, { promise, expires: now + REFRESH_GRACE_PERIOD_MS })
  promise.catch(() => sharedRefreshes.delete(refreshToken))
  return promise
}

// Reloads tokens from the given refresh token and persists them. Throws a 401 when there
// is no refresh token. Shared between the refresh RPC and SSR user resolution
export async function refreshAuthTokens(
  refreshToken: string | undefined,
  setCookie: CookieSetter
): Promise<Tokens> {
  if (!refreshToken) {
    const error = new Error('No refresh token') as Error & { status: number }
    error.status = 401
    throw error
  }
  const tokens = await reloadTokensShared(refreshToken)
  setAuthCookies(setCookie, tokens)
  return tokens
}

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

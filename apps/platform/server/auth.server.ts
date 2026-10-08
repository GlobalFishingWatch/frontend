import { GFWAPI } from '@globalfishingwatch/api-client'

import {
  SSR_HEADERS,
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from 'features/app/app.config'

export type Tokens = { token: string; refreshToken: string }
export type CookieSetter = (key: string, value: string, options?: Record<string, unknown>) => void

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

const REFRESH_DEDUP_TTL_MS = 10_000
const refreshInFlight = new Map<string, { tokens: Promise<Tokens>; expiresAt: number }>()

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
  const now = Date.now()
  for (const [key, entry] of refreshInFlight) {
    if (entry.expiresAt <= now) refreshInFlight.delete(key)
  }
  let entry = refreshInFlight.get(refreshToken)
  if (!entry) {
    const tokens = GFWAPI.reloadTokens(refreshToken, SSR_HEADERS)
    // Don't cache a failed rotation — let the next caller retry against the gateway.
    tokens.catch(() => refreshInFlight.delete(refreshToken))
    entry = { tokens, expiresAt: now + REFRESH_DEDUP_TTL_MS }
    refreshInFlight.set(refreshToken, entry)
  }
  const tokens = await entry.tokens

  // Cookies are set per caller — each request has its own setCookie closure.
  setAuthCookies(setCookie, tokens)
  return tokens
}

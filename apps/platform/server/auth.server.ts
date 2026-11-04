import { CAPTCHA_HEADER, GFWAPI } from '@globalfishingwatch/api-client'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { SSR_HEADERS, SSR_REFERER_HEADERS } from 'server/ssr-headers.server'

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
// is no refresh token. Shared between the refresh RPC and SSR user resolution.
// fromBrowser: the refresh RPC forwards the visitor's captcha instead of the frontend secret, which
// would make the gateway skip it. Without it, it's a server refresh, sent with the secret
export async function refreshAuthTokens({
  refreshToken,
  setCookie,
  fromBrowser,
}: {
  refreshToken: string | undefined
  setCookie: CookieSetter
  fromBrowser?: { captchaToken?: string }
}): Promise<Tokens> {
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
    const tokens = GFWAPI.reloadTokens(
      refreshToken,
      fromBrowser
        ? {
            ...SSR_REFERER_HEADERS,
            ...(fromBrowser.captchaToken && { [CAPTCHA_HEADER]: fromBrowser.captchaToken }),
          }
        : SSR_HEADERS
    )
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

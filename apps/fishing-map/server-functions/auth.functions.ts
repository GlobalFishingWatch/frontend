import { createServerFn } from '@tanstack/react-start'

import { getIsUnauthorizedError, GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import {
  USER_REFRESH_TOKEN_COOKIE_KEY,
  USER_SESSION_COOKIE_KEY,
  USER_TOKEN_COOKIE_KEY,
} from 'features/app/app.config'

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

const httpOnlyCookieOptions = { ...accessCookieOptions, httpOnly: true }

export const setAccessTokenCookie = (setCookie: CookieSetter, token: string) => {
  setCookie(USER_TOKEN_COOKIE_KEY, token, accessCookieOptions)
}

// Sets the session id cookie and actively expires the legacy refresh-token cookie:
// the refresh token now lives ONLY in the server-side session store.
export const setSessionCookie = (setCookie: CookieSetter, sid: string) => {
  setCookie(USER_SESSION_COOKIE_KEY, sid, httpOnlyCookieOptions)
  setCookie(USER_REFRESH_TOKEN_COOKIE_KEY, '', { ...httpOnlyCookieOptions, maxAge: 0 })
}

export const clearAuthCookies = (setCookie: CookieSetter) => {
  setCookie(USER_TOKEN_COOKIE_KEY, '', { ...accessCookieOptions, maxAge: 0 })
  setCookie(USER_SESSION_COOKIE_KEY, '', { ...httpOnlyCookieOptions, maxAge: 0 })
  setCookie(USER_REFRESH_TOKEN_COOKIE_KEY, '', { ...httpOnlyCookieOptions, maxAge: 0 })
}

export const loginServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { accessToken?: string | null }) => data)
  .handler(async ({ data }): Promise<UserData | null> => {
    if (!data.accessToken) return null
    // Dynamic imports keep server-only modules out of the client/test import graph
    const [{ setCookie }, { createSessionRecord, getSessionStore }] = await Promise.all([
      import('@tanstack/react-start/server'),
      import('server/session'),
    ])
    try {
      const tokens = await GFWAPI.exchangeAccessToken(data.accessToken, SSR_HEADERS)
      const sid = crypto.randomUUID()
      const store = await getSessionStore()
      await store.create(sid, createSessionRecord(tokens))
      console.log(
        'GFW session: created',
        sid.slice(0, 8),
        `${tokens.refreshToken.slice(0, 6)}…${tokens.refreshToken.slice(-6)} len=${tokens.refreshToken.length}`
      )
      setAccessTokenCookie(setCookie, tokens.token)
      setSessionCookie(setCookie, sid)
      return GFWAPI.fetchUser({ token: tokens.token, headers: SSR_HEADERS })
    } catch (e) {
      console.error('Failed to exchange access token', e)
      throw e
    }
  })

/**
 * Single serialized token refresh for the session — safe to call from any number of
 * concurrent contexts (tabs, SSR requests, instances); at most one gateway reload
 * happens and everyone gets the rotated token. Throws 401 (SessionGoneError) when the
 * session is missing/revoked and 503 (TransientRefreshError) on gateway/store blips.
 */
export async function refreshSessionTokens(
  sid: string | undefined,
  callerToken?: string
): Promise<{ token: string }> {
  if (!sid) {
    const error = new Error('No session') as Error & { status: number }
    error.status = 401
    throw error
  }
  const { getFreshTokens, getSessionStore } = await import('server/session')
  const store = await getSessionStore()
  return getFreshTokens({
    store,
    sid,
    callerToken,
    reload: (refreshToken) => GFWAPI.reloadTokens(refreshToken, SSR_HEADERS),
  })
}

export const refreshTokenServerFn = createServerFn({ method: 'POST' }).handler(
  async (): Promise<{ token: string }> => {
    const { getCookie, setCookie } = await import('@tanstack/react-start/server')
    try {
      const { token } = await refreshSessionTokens(
        getCookie(USER_SESSION_COOKIE_KEY),
        getCookie(USER_TOKEN_COOKIE_KEY)
      )
      setAccessTokenCookie(setCookie, token)
      return { token }
    } catch (e) {
      if ((e as { status?: number }).status === 401) {
        clearAuthCookies(setCookie)
      }
      throw e
    }
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
    const [{ getCookie, setCookie }, { getSessionStore }] = await Promise.all([
      import('@tanstack/react-start/server'),
      import('server/session'),
    ])
    const sid = getCookie(USER_SESSION_COOKIE_KEY)
    try {
      const store = await getSessionStore()
      const record = sid ? await store.get(sid) : null
      if (sid) await store.delete(sid)
      // Sessions predating the store carry the refresh token in the legacy cookie
      const refreshToken = record?.refreshToken ?? getCookie(USER_REFRESH_TOKEN_COOKIE_KEY)
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

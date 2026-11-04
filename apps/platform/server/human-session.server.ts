import { createHmac, timingSafeEqual } from 'node:crypto'

import { GFWAPI, GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { SSR_HEADERS } from 'server/ssr-headers.server'

const isProduction = process.env.NODE_ENV === 'production'

export const HUMAN_SESSION_COOKIE_KEY = 'gfw-human-session'
// Browsers that restore sessions keep session cookies forever, so the value expires on its own
const HUMAN_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000
const HUMAN_SESSION_SECRET =
  process.env.HUMAN_SESSION_SECRET || (isProduction ? '' : 'development-human-session-secret')

if (isProduction && !HUMAN_SESSION_SECRET) {
  console.error('HUMAN_SESSION_SECRET is not set, no human session will be accepted')
}

// No maxAge: a session cookie, gone when the browser closes
export const humanSessionCookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProduction,
}

const sign = (payload: string) =>
  createHmac('sha256', HUMAN_SESSION_SECRET).update(payload).digest('base64url')

/** Signed `v1.<userId>.<issuedAt>` value: only valid for that user, for 24h */
export function createHumanSession(userId: number) {
  const payload = `v1.${userId}.${Date.now()}`
  return `${payload}.${sign(payload)}`
}

export function isHumanSession(value: string | undefined, userId: number) {
  if (!value || !HUMAN_SESSION_SECRET) return false
  const separator = value.lastIndexOf('.')
  const payload = value.slice(0, separator)
  const signature = Buffer.from(value.slice(separator + 1))
  const expected = Buffer.from(sign(payload))
  if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) {
    return false
  }
  const [version, id, issuedAt] = payload.split('.')
  return (
    version === 'v1' &&
    id === String(userId) &&
    Date.now() - Number(issuedAt) < HUMAN_SESSION_MAX_AGE_MS
  )
}

/** Logged user of the request, verified by the gateway from the token cookie. Null for guests */
export async function getRequestUserId(): Promise<number | null> {
  const { getCookie } = await import('@tanstack/react-start/server')
  const token = getCookie(USER_TOKEN_COOKIE_KEY)
  if (!token) return null
  try {
    const user = await GFWAPI.fetchUser({ token, headers: SSR_HEADERS })
    return user.type === GUEST_USER_TYPE ? null : user.id
  } catch {
    return null
  }
}

/** For server code that must only serve sessions that passed the captcha */
export async function hasHumanSession() {
  const { getCookie } = await import('@tanstack/react-start/server')
  const userId = await getRequestUserId()
  return userId !== null && isHumanSession(getCookie(HUMAN_SESSION_COOKIE_KEY), userId)
}

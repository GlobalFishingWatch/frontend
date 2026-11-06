import { createHmac, timingSafeEqual } from 'node:crypto'

import { serverEnv } from 'server/env.server'
import { getRequestUser } from 'server/user.server'

const isProduction = process.env.NODE_ENV === 'production'

export const HUMAN_SESSION_COOKIE_KEY = 'gfw-human-session'
// Browsers that restore sessions keep session cookies forever, so the value expires on its own
const HUMAN_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000
const HUMAN_SESSION_SECRET =
  serverEnv.HUMAN_SESSION_SECRET || (isProduction ? '' : 'development-human-session-secret')

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

/** For server code that must only serve sessions that passed the captcha */
export async function hasHumanSession() {
  const { getCookie } = await import('@tanstack/react-start/server')
  const user = await getRequestUser()
  return user !== null && isHumanSession(getCookie(HUMAN_SESSION_COOKIE_KEY), user.id)
}

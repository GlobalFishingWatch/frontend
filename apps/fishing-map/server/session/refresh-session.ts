import type { SessionRecord, SessionStore } from './session-store.types'

/**
 * Serialized token rotation with a grace window.
 *
 * The GFW gateway rotates the refresh token on EVERY reload and revokes ALL of a
 * user's tokens when a rotated token is replayed — with no grace window. So across
 * every concurrent context sharing a session (tabs, parallel SSR requests, multiple
 * Cloud Run instances) at most ONE caller may use the refresh token; everyone else
 * must be served the already-rotated result. This module builds that guarantee (and
 * the grace window the gateway refuses to provide) on top of an atomic SessionStore:
 * a short per-session lease elects the single rotator, and recently-rotated tokens
 * are served straight from the store.
 */

export type RefreshTiming = {
  /** Serve the stored token without reloading when rotated more recently than this */
  graceMs: number
  /** How long a rotation lease is held before waiters may steal it */
  leaseMs: number
  /** Timeout for the gateway reload call — must stay below leaseMs */
  reloadTimeoutMs: number
  /** How often waiters re-check the store while another caller holds the lease */
  pollMs: number
  /** Give up waiting on a lease after this long */
  waitDeadlineMs: number
  /** Consider a stored token servable only if it outlives this margin */
  expiryMarginMs: number
}

export const DEFAULT_REFRESH_TIMING: RefreshTiming = {
  graceMs: 45_000,
  leaseMs: 15_000,
  reloadTimeoutMs: 8_000,
  pollMs: 300,
  waitDeadlineMs: 20_000,
  expiryMarginMs: 60_000,
}

const FALLBACK_TOKEN_TTL_MS = 25 * 60_000

export type ReloadTokensFn = (
  refreshToken: string
) => Promise<{ token: string; refreshToken: string }>

/** The session is missing or its refresh token was rejected — the user must re-login */
export class SessionGoneError extends Error {
  status = 401
  constructor(message = 'Session not found or revoked') {
    super(message)
  }
}

/** Transient store/gateway failure — the session is intact, the caller may retry */
export class TransientRefreshError extends Error {
  status = 503
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export function jwtExpiryMs(token: string): number | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function createSessionRecord(
  tokens: { token: string; refreshToken: string },
  rotatedAt = Date.now()
): SessionRecord {
  return {
    refreshToken: tokens.refreshToken,
    token: tokens.token,
    tokenExpiresAt: jwtExpiryMs(tokens.token) ?? (rotatedAt ? rotatedAt + FALLBACK_TOKEN_TTL_MS : 0),
    rotatedAt,
    leaseId: null,
    leaseUntil: 0,
  }
}

const isServable = (record: SessionRecord, callerToken: string | undefined, t: RefreshTiming) =>
  Date.now() - record.rotatedAt < t.graceMs ||
  // The store already holds a NEWER, still-valid token than the one that just failed
  // for the caller. If they are the same token, it was revoked — we must reload.
  (record.token !== callerToken && record.tokenExpiresAt > Date.now() + t.expiryMarginMs)

type LeaseAttempt =
  | { type: 'gone' }
  | { type: 'fresh'; token: string }
  | { type: 'wait' }
  | { type: 'lease'; leaseId: string; refreshToken: string; rotatedAt: number }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Token reload timed out after ${ms}ms`)), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

export async function getFreshTokens({
  store,
  sid,
  callerToken,
  reload,
  timing = DEFAULT_REFRESH_TIMING,
}: {
  store: SessionStore
  sid: string
  /** The access token the caller already has (and presumably just got a 401 with) */
  callerToken?: string
  reload: ReloadTokensFn
  timing?: RefreshTiming
}): Promise<{ token: string }> {
  // Fast path — plain read, no transaction
  const record = await store.get(sid)
  if (!record) throw new SessionGoneError()
  if (isServable(record, callerToken, timing)) return { token: record.token }

  const deadline = Date.now() + timing.waitDeadlineMs
  for (;;) {
    const attempt = await tryServeOrLease(store, sid, callerToken, timing)
    if (attempt.type === 'gone') throw new SessionGoneError()
    if (attempt.type === 'fresh') return { token: attempt.token }
    if (attempt.type === 'wait') {
      // Never steal a live lease — the holder's reload may have consumed the token
      if (Date.now() > deadline) {
        throw new TransientRefreshError('Timed out waiting for a concurrent token refresh')
      }
      await sleep(timing.pollMs)
      continue
    }
    return { token: await rotate(store, sid, attempt, reload, timing) }
  }
}

async function tryServeOrLease(
  store: SessionStore,
  sid: string,
  callerToken: string | undefined,
  timing: RefreshTiming
): Promise<LeaseAttempt> {
  const leaseId = crypto.randomUUID()
  let attempt: LeaseAttempt = { type: 'gone' }
  await store.update(sid, (record) => {
    if (!record) {
      attempt = { type: 'gone' }
      return null
    }
    if (isServable(record, callerToken, timing)) {
      attempt = { type: 'fresh', token: record.token }
      return null
    }
    if (record.leaseUntil > Date.now()) {
      attempt = { type: 'wait' }
      return null
    }
    attempt = { type: 'lease', leaseId, refreshToken: record.refreshToken, rotatedAt: record.rotatedAt }
    return { leaseId, leaseUntil: Date.now() + timing.leaseMs }
  })
  return attempt
}

/** We hold the lease → we are the single rotator across ALL instances */
async function rotate(
  store: SessionStore,
  sid: string,
  lease: Extract<LeaseAttempt, { type: 'lease' }>,
  reload: ReloadTokensFn,
  timing: RefreshTiming
): Promise<string> {
  let tokens: Awaited<ReturnType<ReloadTokensFn>>
  try {
    tokens = await withTimeout(reload(lease.refreshToken), timing.reloadTimeoutMs)
  } catch (e) {
    // Release the lease only if it is still ours
    await store
      .update(sid, (record) =>
        record?.leaseId === lease.leaseId ? { leaseId: null, leaseUntil: 0 } : null
      )
      .catch(() => {})
    const status = (e as { status?: number })?.status
    if (status === 401 || status === 403) {
      // Refresh token dead (consumed elsewhere or revoked) → only THIS session dies
      await store.delete(sid).catch(() => {})
      throw new SessionGoneError('Refresh token rejected by the gateway')
    }
    // 5xx/network/timeout: the session survives, waiters retry
    throw new TransientRefreshError('Token reload failed transiently', { cause: e })
  }

  console.log('GFW session: rotated tokens', sid.slice(0, 8))
  await store.update(sid, (record) => {
    if (!record) return null
    const rotated = {
      refreshToken: tokens.refreshToken,
      token: tokens.token,
      tokenExpiresAt: jwtExpiryMs(tokens.token) ?? Date.now() + FALLBACK_TOKEN_TTL_MS,
      rotatedAt: Date.now(),
    }
    if (record.leaseId === lease.leaseId) return { ...rotated, leaseId: null, leaseUntil: 0 }
    // We outlived our lease. Our reload consumed the refresh token everyone else would
    // replay, so persisting is still the only correct move — unless someone rotated
    // after us, in which case the gateway has already revoked the whole session.
    if (record.rotatedAt === lease.rotatedAt) return rotated
    console.error(
      'GFW session: rotation conflict after a lost lease — the gateway has likely revoked this session'
    )
    return null
  })
  return tokens.token
}

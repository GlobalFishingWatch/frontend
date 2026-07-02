import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { MemorySessionStore } from './memory-session-store'
import type { RefreshTiming, ReloadTokensFn } from './refresh-session'
import {
  createSessionRecord,
  getFreshTokens,
  SessionGoneError,
  TransientRefreshError,
} from './refresh-session'

const TIMING: RefreshTiming = {
  graceMs: 200,
  leaseMs: 100,
  reloadTimeoutMs: 80,
  pollMs: 5,
  waitDeadlineMs: 500,
  expiryMarginMs: 50,
}

const SID = 'test-sid'

// The global setup freezes the clock (vi.setSystemTime); leases, grace windows and
// wait deadlines need Date.now() to actually advance.
beforeAll(() => {
  vi.useRealTimers()
})

/**
 * Fake gateway with the real GFW semantics: every reload rotates the refresh token and
 * replaying an already-consumed one revokes the whole session (throws 401).
 */
function createFakeGateway(initialRefreshToken: string) {
  let currentRefreshToken = initialRefreshToken
  let reloadCalls = 0
  let generation = 0
  const reload: ReloadTokensFn = async (refreshToken) => {
    reloadCalls++
    if (refreshToken !== currentRefreshToken) {
      const error = new Error('Refresh token reuse — all tokens revoked') as Error & {
        status: number
      }
      error.status = 401
      throw error
    }
    generation++
    currentRefreshToken = `refresh-${generation}`
    return { token: `token-${generation}`, refreshToken: currentRefreshToken }
  }
  return {
    reload,
    get reloadCalls() {
      return reloadCalls
    },
  }
}

// An expired session record: outside the grace window, token past expiry
function expiredRecord(refreshToken: string, token = 'expired-token') {
  return {
    refreshToken,
    token,
    tokenExpiresAt: Date.now() - 1000,
    rotatedAt: Date.now() - 10_000,
    leaseId: null,
    leaseUntil: 0,
  }
}

describe('getFreshTokens', () => {
  let store: MemorySessionStore

  beforeEach(() => {
    store = new MemorySessionStore()
  })

  it('serves a recently rotated token from the grace window without reloading', async () => {
    const gateway = createFakeGateway('refresh-0')
    await store.create(SID, createSessionRecord({ token: 'fresh', refreshToken: 'refresh-0' }))
    const { token } = await getFreshTokens({ store, sid: SID, reload: gateway.reload, timing: TIMING })
    expect(token).toBe('fresh')
    expect(gateway.reloadCalls).toBe(0)
  })

  it('reloads exactly once for 50 concurrent callers and gives everyone the same token', async () => {
    const gateway = createFakeGateway('refresh-0')
    await store.create(SID, expiredRecord('refresh-0'))

    const results = await Promise.all(
      Array.from({ length: 50 }, () =>
        getFreshTokens({
          store,
          sid: SID,
          callerToken: 'expired-token',
          reload: gateway.reload,
          timing: TIMING,
        })
      )
    )

    expect(gateway.reloadCalls).toBe(1)
    expect(new Set(results.map((r) => r.token))).toEqual(new Set(['token-1']))
  })

  it('reloads exactly once more for a second wave after the grace window', async () => {
    const gateway = createFakeGateway('refresh-0')
    await store.create(SID, expiredRecord('refresh-0'))
    await getFreshTokens({
      store,
      sid: SID,
      callerToken: 'expired-token',
      reload: gateway.reload,
      timing: TIMING,
    })

    // Second wave: outside grace, callers hold the rotated token (as if it got revoked)
    await store.update(SID, () => ({ rotatedAt: Date.now() - TIMING.graceMs - 1, tokenExpiresAt: 0 }))
    const results = await Promise.all(
      Array.from({ length: 10 }, () =>
        getFreshTokens({
          store,
          sid: SID,
          callerToken: 'token-1',
          reload: gateway.reload,
          timing: TIMING,
        })
      )
    )
    expect(gateway.reloadCalls).toBe(2)
    expect(new Set(results.map((r) => r.token))).toEqual(new Set(['token-2']))
  })

  it('serves the stored token when the caller holds an older one, without reloading', async () => {
    const gateway = createFakeGateway('refresh-0')
    await store.create(SID, {
      refreshToken: 'refresh-0',
      token: 'newer-token',
      tokenExpiresAt: Date.now() + 60_000,
      rotatedAt: Date.now() - TIMING.graceMs - 1, // outside grace
      leaseId: null,
      leaseUntil: 0,
    })
    const { token } = await getFreshTokens({
      store,
      sid: SID,
      callerToken: 'older-token',
      reload: gateway.reload,
      timing: TIMING,
    })
    expect(token).toBe('newer-token')
    expect(gateway.reloadCalls).toBe(0)
  })

  it('throws SessionGoneError for an unknown sid', async () => {
    const gateway = createFakeGateway('refresh-0')
    await expect(
      getFreshTokens({ store, sid: 'nope', reload: gateway.reload, timing: TIMING })
    ).rejects.toBeInstanceOf(SessionGoneError)
  })

  it('deletes the session and throws SessionGoneError when the gateway rejects the refresh token', async () => {
    await store.create(SID, expiredRecord('stale-refresh'))
    const gateway = createFakeGateway('refresh-0') // gateway expects a different token

    await expect(
      getFreshTokens({
        store,
        sid: SID,
        callerToken: 'expired-token',
        reload: gateway.reload,
        timing: TIMING,
      })
    ).rejects.toBeInstanceOf(SessionGoneError)
    expect(await store.get(SID)).toBeNull()
  })

  it('keeps the session and releases the lease on a transient reload failure', async () => {
    await store.create(SID, expiredRecord('refresh-0'))
    let calls = 0
    const flaky: ReloadTokensFn = async () => {
      calls++
      if (calls === 1) {
        const error = new Error('Bad gateway') as Error & { status: number }
        error.status = 502
        throw error
      }
      return { token: 'token-after-blip', refreshToken: 'refresh-after-blip' }
    }

    await expect(
      getFreshTokens({ store, sid: SID, callerToken: 'expired-token', reload: flaky, timing: TIMING })
    ).rejects.toBeInstanceOf(TransientRefreshError)

    const record = await store.get(SID)
    expect(record).not.toBeNull()
    expect(record?.refreshToken).toBe('refresh-0')
    expect(record?.leaseUntil).toBe(0)

    // The next caller recovers
    const { token } = await getFreshTokens({
      store,
      sid: SID,
      callerToken: 'expired-token',
      reload: flaky,
      timing: TIMING,
    })
    expect(token).toBe('token-after-blip')
  })

  it('recovers after a crashed lease holder once the lease expires', async () => {
    const gateway = createFakeGateway('refresh-0')
    await store.create(SID, {
      ...expiredRecord('refresh-0'),
      leaseId: 'crashed-holder',
      leaseUntil: Date.now() + 30, // expires soon; holder never comes back
    })

    const { token } = await getFreshTokens({
      store,
      sid: SID,
      callerToken: 'expired-token',
      reload: gateway.reload,
      timing: TIMING,
    })
    expect(token).toBe('token-1')
    expect(gateway.reloadCalls).toBe(1)
  })

  it('times out with a transient error instead of stealing a live lease', async () => {
    const gateway = createFakeGateway('refresh-0')
    await store.create(SID, {
      ...expiredRecord('refresh-0'),
      leaseId: 'busy-holder',
      leaseUntil: Date.now() + 60_000, // held way past the wait deadline
    })

    await expect(
      getFreshTokens({
        store,
        sid: SID,
        callerToken: 'expired-token',
        reload: gateway.reload,
        timing: { ...TIMING, waitDeadlineMs: 30 },
      })
    ).rejects.toBeInstanceOf(TransientRefreshError)
    expect(gateway.reloadCalls).toBe(0)
  })

  it('treats a hung reload as transient after the timeout', async () => {
    await store.create(SID, expiredRecord('refresh-0'))
    const hung: ReloadTokensFn = () => new Promise(() => {})

    await expect(
      getFreshTokens({ store, sid: SID, callerToken: 'expired-token', reload: hung, timing: TIMING })
    ).rejects.toBeInstanceOf(TransientRefreshError)
    expect(await store.get(SID)).not.toBeNull()
  })
})

describe('createIfAbsent migration race', () => {
  it('concurrent migrations converge on a single record', async () => {
    const store = new MemorySessionStore()
    const record = createSessionRecord({ token: 'legacy', refreshToken: 'legacy-refresh' }, 0)
    const results = await Promise.all(
      Array.from({ length: 10 }, () => store.createIfAbsent('same-sid', record))
    )
    expect(new Set(results.map((r) => r.refreshToken))).toEqual(new Set(['legacy-refresh']))
    expect((await store.get('same-sid'))?.rotatedAt).toBe(0)
  })
})

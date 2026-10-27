import { describe, expect, vi } from 'vitest'

import { createApiClient, it } from './helpers'

describe('GFW_API_CLASS', () => {
  describe('configure / SSR auth model', () => {
    it('should use a per-request token for the bearer without touching the stored token', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'stored-token')
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))

      await client.fetch('/protected', { token: 'per-request-token' })

      expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer per-request-token')
      // The shared singleton's token must be untouched (no cross-request leak).
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBe('stored-token')
      expect(client.token).toBe('stored-token')
    })

    it('should NOT refresh or retry on a 401 when a per-request token is used (single request)', async ({
      client,
      fetchMock,
    }) => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          statusText: 'Unauthorized',
        })
      )

      await expect(client.fetch('/protected', { token: 'tok' })).rejects.toMatchObject({
        status: 401,
      })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should refresh via the configured strategy (not /tokens/reload) and retry with the rotated token', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      const refreshStrategy = vi.fn(async () => {
        storage.setItem('GFW_API_USER_TOKEN', 'new-token')
        return { token: 'new-token', refreshToken: 'new-refresh' }
      })
      client.configure({ refreshStrategy })

      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )
        .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))

      const result = await client.fetch('/protected')

      expect(result).toEqual({ ok: true })
      expect(refreshStrategy).toHaveBeenCalledTimes(1)
      // The retry re-reads the rotated token from storage.
      expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe('Bearer new-token')
      // No /tokens/reload call: only the original request + the retry.
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    // Race: many concurrent requests 401 at once. They must share a SINGLE refresh
    // (the `refreshingToken` dedup), not stampede the strategy once per request.
    it('should share one refresh-strategy call across concurrent auth retries (dedup)', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      const refreshStrategy = vi.fn(async () => {
        storage.setItem('GFW_API_USER_TOKEN', 'new-token')
        return { token: 'new-token', refreshToken: 'new-refresh' }
      })
      client.configure({ refreshStrategy })

      const pendingAuthErrors: ((response: Response) => void)[] = []
      fetchMock.mockImplementation((url, options) => {
        if (options.headers.Authorization === 'Bearer old-token') {
          return new Promise((resolve) => {
            pendingAuthErrors.push(resolve)
          })
        }
        return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      })

      const request1 = client.fetch<{ ok: boolean }>('/datasets/1')
      const request2 = client.fetch<{ ok: boolean }>('/datasets/2')

      // Both initial requests are in flight; fail them together.
      expect(pendingAuthErrors).toHaveLength(2)
      pendingAuthErrors.forEach((resolve) => {
        resolve(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )
      })

      await expect(Promise.all([request1, request2])).resolves.toEqual([{ ok: true }, { ok: true }])
      // Deduped: one strategy call refreshes for both, and both retry with the new token.
      expect(refreshStrategy).toHaveBeenCalledTimes(1)
      const retried = fetchMock.mock.calls.filter(
        ([, options]) => options.headers.Authorization === 'Bearer new-token'
      )
      expect(retried).toHaveLength(2)
    })

    // Race: multiple tabs refresh at once. The strategy must run inside the Web Lock
    // so the gateway only rotates the (single httpOnly) refresh token once at a time.
    it('should run the configured strategy refresh inside the Web Lock', async () => {
      const requestSpy = vi.fn((_name: string, cb: () => Promise<unknown>) => cb())
      vi.stubGlobal('navigator', { locks: { request: requestSpy } })
      const client = createApiClient()
      const refreshStrategy = vi.fn(async () => ({ token: 'new', refreshToken: 'new-refresh' }))
      client.configure({ refreshStrategy })

      await client.refreshAPIToken()

      expect(requestSpy).toHaveBeenCalledWith('gfw-token-refresh', expect.any(Function))
      expect(refreshStrategy).toHaveBeenCalledTimes(1)
    })

    // A configured strategy that rejects (e.g. the httpOnly refresh cookie is gone)
    // must surface as a normal auth failure, not loop.
    it('should propagate a rejected strategy refresh as a 401 (no infinite retry)', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      const refreshStrategy = vi.fn(async () => {
        const error: any = new Error('No refresh token')
        error.status = 401
        throw error
      })
      client.configure({ refreshStrategy })

      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          statusText: 'Unauthorized',
        })
      )

      await expect(client.fetch('/protected')).rejects.toMatchObject({ status: 401 })
      expect(refreshStrategy).toHaveBeenCalledTimes(1)
    })

    it('should call sessionInvalidateStrategy when refresh is rejected with 401', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'invalid-refresh')
      const sessionInvalidateStrategy = vi.fn()
      client.configure({ sessionInvalidateStrategy })

      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Invalid refresh' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )

      await expect(client.fetch('/datasets/1')).rejects.toMatchObject({ status: 401 })
      expect(sessionInvalidateStrategy).toHaveBeenCalledTimes(1)
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBeNull()
    })
  })

  describe('refresh token with a refreshStrategy', () => {
    it('ignores localStorage for the refresh token when a refreshStrategy is configured', ({
      client,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'stale-localstorage-refresh')
      client.configure({ refreshStrategy: async () => ({ token: 't', refreshToken: 'r' }) })

      // The strategy owns the refresh token — the client must not surface the stale local one.
      expect(client.refreshToken).toBe('')
    })
  })

  describe('legacy localStorage defaults (no configure)', () => {
    it('reads tokens from localStorage and clears them on logout', async ({
      fetchMock,
      storage,
    }) => {
      fetchMock.mockImplementation(
        async () => new Response(JSON.stringify({ ok: true }), { status: 200 })
      )
      const client = createApiClient()
      storage.setItem('GFW_API_USER_TOKEN', 'legacy-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'legacy-refresh')

      // The public getter reads straight from localStorage (default storage).
      expect(client.token).toBe('legacy-token')

      await client.logout()
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBeNull()
      expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBeNull()
      expect(client.token).toBe('')
    })
  })
})

import { afterEach, describe, expect, vi } from 'vitest'

import { createApiClient, it } from './helpers'

describe('GFW_API_CLASS', () => {
  describe('refreshAPIToken', () => {
    it('should throw when no refresh token', async ({ client }) => {
      await expect(client.refreshAPIToken()).rejects.toThrow('No refresh token')
    })

    it('should refresh token and update storage', async ({ client, fetchMock, storage }) => {
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'old-refresh')

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
          status: 200,
        })
      )

      const result = await client.refreshAPIToken()

      expect(result).toEqual({ token: 'new-token', refreshToken: 'new-refresh' })
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBe('new-token')
      expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBe('new-refresh')
    })

    it('should throw with status 401 when refresh fails', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'invalid-refresh')

      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Invalid' }), {
          status: 401,
          statusText: 'Unauthorized',
        })
      )

      await expect(client.refreshAPIToken()).rejects.toMatchObject({ status: 401 })
    })

    it('should return the active refresh when already refreshing', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

      fetchMock.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  new Response(
                    JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }),
                    { status: 200 }
                  )
                ),
              50
            )
          )
      )

      const [result1, result2] = await Promise.all([
        client.refreshAPIToken(),
        client.refreshAPIToken(),
      ])

      expect(result1).toEqual({ token: 'new-token', refreshToken: 'new-refresh' })
      expect(result2).toEqual({ token: 'new-token', refreshToken: 'new-refresh' })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should retry with the latest refresh token when storage changed in another tab', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'old-refresh')

      fetchMock
        .mockImplementationOnce((_url, options) => {
          expect(options.headers['refresh-token']).toBe('old-refresh')
          storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'latest-refresh')
          return Promise.resolve(
            new Response(JSON.stringify({ message: 'Invalid refresh' }), {
              status: 401,
              statusText: 'Unauthorized',
            })
          )
        })
        .mockImplementationOnce((_url, options) => {
          expect(options.headers['refresh-token']).toBe('latest-refresh')
          return Promise.resolve(
            new Response(JSON.stringify({ token: 'new-token', refreshToken: 'newest-refresh' }), {
              status: 200,
            })
          )
        })

      const result = await client.refreshAPIToken()

      expect(result).toEqual({ token: 'new-token', refreshToken: 'newest-refresh' })
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBe('new-token')
      expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBe('newest-refresh')
    })
  })

  describe('token refresh resilience', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('should retry the reload on a transient 5xx failure', async ({ fetchMock, storage }) => {
      vi.useFakeTimers()
      const client = createApiClient()
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Server Error' }), {
            status: 503,
            statusText: 'Service Unavailable',
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
            status: 200,
          })
        )

      const promise = client.refreshAPIToken()
      await vi.runAllTimersAsync()
      const result = await promise

      expect(result).toEqual({ token: 'new-token', refreshToken: 'new-refresh' })
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('should retry the reload on a transient network failure', async ({ fetchMock, storage }) => {
      vi.useFakeTimers()
      const client = createApiClient()
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValueOnce(
        new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
          status: 200,
        })
      )

      const promise = client.refreshAPIToken()
      await vi.runAllTimersAsync()
      const result = await promise

      expect(result).toEqual({ token: 'new-token', refreshToken: 'new-refresh' })
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('should give up after maxReloadRetries transient failures', async ({
      fetchMock,
      storage,
    }) => {
      vi.useFakeTimers()
      const client = createApiClient()
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Server Error' }), {
          status: 503,
          statusText: 'Service Unavailable',
        })
      )

      const promise = client.refreshAPIToken()
      const expectation = expect(promise).rejects.toMatchObject({ status: 503 })
      await vi.runAllTimersAsync()
      await expectation

      // 1 initial attempt + maxReloadRetries (2) = 3
      expect(fetchMock).toHaveBeenCalledTimes(client.maxReloadRetries + 1)
    })

    it('should NOT retry the reload on a 401 (invalid refresh token)', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'invalid-refresh')

      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Invalid' }), {
          status: 401,
          statusText: 'Unauthorized',
        })
      )

      await expect(client.refreshAPIToken()).rejects.toMatchObject({ status: 401 })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('multi-tab refresh lock', () => {
    it('should run the refresh inside the Web Lock when available', async ({
      fetchMock,
      storage,
    }) => {
      const requestSpy = vi.fn((_name: string, cb: () => Promise<unknown>) => cb())
      vi.stubGlobal('navigator', { locks: { request: requestSpy } })

      const client = createApiClient()
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
          status: 200,
        })
      )

      await client.refreshAPIToken()

      expect(requestSpy).toHaveBeenCalledWith('gfw-token-refresh', expect.any(Function))
    })

    it('should skip the network call when another tab already rotated the token', async ({
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'old-refresh')

      // Simulate another tab finishing a refresh while we waited for the lock:
      // the stored tokens are rotated before our callback runs.
      vi.stubGlobal('navigator', {
        locks: {
          request: (_name: string, cb: () => Promise<unknown>) => {
            storage.setItem('GFW_API_USER_TOKEN', 'rotated-token')
            storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'rotated-refresh')
            return cb()
          },
        },
      })

      const client = createApiClient()

      const result = await client.refreshAPIToken()

      expect(result).toEqual({ token: 'rotated-token', refreshToken: 'rotated-refresh' })
      // The consumed 'old-refresh' is never replayed against the server.
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})

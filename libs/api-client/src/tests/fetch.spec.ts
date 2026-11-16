import { describe, expect, vi } from 'vitest'

import type { ApiVersion } from '../api-client'
import { API_GATEWAY } from '../config'

import { createApiClient, it } from './helpers'

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

describe('GFW_API_CLASS', () => {
  describe('fetch', () => {
    it('should return JSON response when fetch succeeds', async ({ client, fetchMock }) => {
      const mockData = { id: 1, name: 'test' }
      fetchMock.mockResolvedValue(new Response(JSON.stringify(mockData), { status: 200 }))

      const result = await client.fetch<typeof mockData>('/datasets/1')

      expect(result).toEqual(mockData)
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('datasets/1'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ',
          }),
        })
      )
    })

    it('should re-read function headers on each attempt (no stale capture across retry)', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-A')

      fetchMock
        // initial request → 401, triggers refresh
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )
        // /tokens/reload → 200, rotates refresh-A → refresh-B
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ token: 'new-token', refreshToken: 'refresh-B' }), {
            status: 200,
          })
        )
        // retried request → 200
        .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))

      await client.fetch('/protected', {
        headers: () => ({
          'x-refresh': storage.getItem('GFW_API_USER_REFRESH_TOKEN') ?? '',
        }),
      })

      // First attempt sends the original token, the retry re-reads the rotated one.
      expect(fetchMock.mock.calls[0][1].headers['x-refresh']).toBe('refresh-A')
      expect(fetchMock.mock.calls[2][1].headers['x-refresh']).toBe('refresh-B')
    })

    it('should pass body and method for POST', async ({ client, fetchMock }) => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))

      await client.fetch('/datasets', {
        method: 'POST',
        body: { name: 'new dataset' },
      })

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'new dataset' }),
        })
      )
    })

    it('should throw parsed error on 4xx response', async ({ client, fetchMock }) => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not found', messages: [] }), {
          status: 404,
          statusText: 'Not Found',
        })
      )

      await expect(client.fetch('/datasets/999')).rejects.toMatchObject({
        status: 404,
        message: 'Not found',
      })
    })

    it('should use custom version from options', async ({ client, fetchMock }) => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))

      await client.fetch('/datasets', { version: 'v2' as ApiVersion })

      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/v2/'), expect.any(Object))
    })

    it('should return blob for responseType blob', async ({ client, fetchMock }) => {
      const blob = new Blob(['data'])
      const response = new Response(null, { status: 200 })
      vi.spyOn(response, 'blob').mockResolvedValue(blob)
      fetchMock.mockResolvedValue(response)

      const result = await client.fetch<Blob>('/file', { responseType: 'blob' })

      expect(result).toBe(blob)
    })

    it('should return text for responseType text', async ({ client, fetchMock }) => {
      fetchMock.mockResolvedValue(new Response('plain text', { status: 200 }))

      const result = await client.fetch<string>('/file', { responseType: 'text' })

      expect(result).toBe('plain text')
    })

    it('should return undefined for 204 No Content', async ({ client, fetchMock }) => {
      fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

      const result = await client.fetch('/endpoint')

      expect(result).toBeUndefined()
    })

    it('should return raw response for responseType default', async ({ client, fetchMock }) => {
      const response = new Response('ok', { status: 200 })
      fetchMock.mockResolvedValue(response)

      const result = await client.fetch<Response>('/endpoint', {
        responseType: 'default',
      })

      expect(result).toBe(response)
    })

    it('should return data and headers for responseType withHeaders', async ({
      client,
      fetchMock,
    }) => {
      const response = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'X-Deprecated-Dataset': 'old-id=new-id' },
      })
      fetchMock.mockResolvedValue(response)

      const result = await client.fetch<{ data: { ok: boolean }; headers: Headers }>('/datasets', {
        responseType: 'withHeaders',
      })

      expect(result).toEqual({ data: { ok: true }, headers: expect.any(Headers) })
      expect(result.headers.get('X-Deprecated-Dataset')).toBe('old-id=new-id')
    })

    it('should throw parsed error for responseType withHeaders on 4xx', async ({
      client,
      fetchMock,
    }) => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not found', messages: [] }), {
          status: 404,
          statusText: 'Not Found',
        })
      )

      await expect(
        client.fetch('/datasets/999', { responseType: 'withHeaders' })
      ).rejects.toMatchObject({
        status: 404,
        message: 'Not found',
      })
    })

    it('should return arrayBuffer for responseType arrayBuffer', async ({ client, fetchMock }) => {
      const buffer = new ArrayBuffer(8)
      fetchMock.mockResolvedValue(new Response(buffer, { status: 200 }))

      const result = await client.fetch<ArrayBuffer>('/binary', {
        responseType: 'arrayBuffer',
      })

      expect(result).toBeInstanceOf(ArrayBuffer)
      expect((result as ArrayBuffer).byteLength).toBe(8)
    })

    it('should return vessel data for responseType vessel', async ({ client, fetchMock }) => {
      fetchMock.mockResolvedValue(new Response(new Uint8Array(0).buffer, { status: 200 }))

      const result = await client.fetch<number[]>('/vessels/track', {
        responseType: 'vessel',
      })

      expect(result).toEqual([])
    })

    it('should include local headers when local option is true', async ({ client, fetchMock }) => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))

      await client.fetch('/datasets', { local: true })

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-gateway-url': API_GATEWAY,
            user: expect.any(String),
          }),
        })
      )
    })

    it('should retry on 401 after refreshing token', async ({ client, fetchMock, storage }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
            status: 200,
          })
        )
        .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1 }), { status: 200 }))

      const result = await client.fetch<{ id: number }>('/datasets/1')

      expect(result).toEqual({ id: 1 })
      expect(fetchMock).toHaveBeenCalledTimes(3)
    })

    it('should share one token refresh across concurrent auth retries', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')
      const pendingAuthErrors: ((response: Response) => void)[] = []

      fetchMock.mockImplementation((url, options) => {
        if (String(url).includes('/auth/tokens/reload')) {
          return Promise.resolve(
            new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
              status: 200,
            })
          )
        }
        if (options.headers.Authorization === 'Bearer old-token') {
          return new Promise((resolve) => {
            pendingAuthErrors.push(resolve)
          })
        }
        return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      })

      const request1 = client.fetch<{ ok: boolean }>('/datasets/1')
      const request2 = client.fetch<{ ok: boolean }>('/datasets/2')

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
      const refreshCalls = fetchMock.mock.calls.filter(([url]) =>
        String(url).includes('/auth/tokens/reload')
      )
      const retriedCalls = fetchMock.mock.calls.filter(([, options]) => {
        return options.headers.Authorization === 'Bearer new-token'
      })
      expect(refreshCalls).toHaveLength(1)
      expect(retriedCalls).toHaveLength(2)
    })

    it('should retry on 500', async ({ client, fetchMock }) => {
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Server error' }), {
            status: 500,
            statusText: 'Internal Server Error',
          })
        )
        .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1 }), { status: 200 }))

      const result = await client.fetch<{ id: number }>('/datasets/1')

      expect(result).toEqual({ id: 1 })
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('should clear tokens and throw when refresh fails on 401', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'invalid-refresh')

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

      await expect(client.fetch('/datasets/1')).rejects.toMatchObject({
        status: 401,
        message: expect.any(String),
      })
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBeNull()
      expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBeNull()
    })

    it('should NOT wipe tokens when the refresh is rejected with 403 (forbidden, not invalid token)', async ({
      client,
      fetchMock,
      storage,
    }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'old-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

      fetchMock
        // original request → 401, triggers a refresh
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )
        // /tokens/reload → 403 (forbidden, NOT an invalid refresh token)
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Forbidden' }), {
            status: 403,
            statusText: 'Forbidden',
          })
        )

      // The original error surfaces, but it is NOT flagged as a refresh failure.
      const error: any = await client.fetch('/datasets/1').catch((e) => e)
      expect(error.refreshError).toBeUndefined()
      // A 403 is "authenticated but forbidden", not "invalid refresh token" — keep the session.
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBe('old-token')
      expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBe('refresh-token')
    })

    it('should throw raw error for responseType default on 4xx', async ({ client, fetchMock }) => {
      const errorResponse = new Response(JSON.stringify({ message: 'Not found' }), {
        status: 404,
        statusText: 'Not Found',
      })
      fetchMock.mockResolvedValue(errorResponse)

      await expect(client.fetch('/datasets', { responseType: 'default' })).rejects.toBe(
        errorResponse
      )
    })

    it('should continue fetch after login rejects when logging is in progress', async ({
      fetchMock,
    }) => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const client = createApiClient({ debug: true })
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: 'Invalid' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )
        .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1 }), { status: 200 }))

      const loginPromise = client.login({ accessToken: 'invalid' })
      const fetchPromise = client.fetch<{ id: number }>('/datasets/1')

      await expect(loginPromise).rejects.toThrow('Invalid access token')
      const result = await fetchPromise
      expect(result).toEqual({ id: 1 })
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('login failed — fetch continues without session'),
        expect.anything()
      )
      logSpy.mockRestore()
    })
  })

  describe('download', () => {
    it('should download file and return true', async ({ fetchMock }) => {
      const fileSave = await import('file-saver')
      const client = createApiClient()
      const blob = new Blob(['content'])
      const response = new Response(null, { status: 200 })
      vi.spyOn(response, 'blob').mockResolvedValue(blob)
      fetchMock.mockResolvedValue(response)

      const result = await client.download('https://example.com/file.pdf', 'file.pdf')

      expect(result).toBe(true)
      expect(fileSave.saveAs).toHaveBeenCalledWith(blob, 'file.pdf')
    })

    it('should return false when download fails', async ({ client, fetchMock }) => {
      fetchMock.mockRejectedValue(new Error('Network error'))

      const result = await client.download('https://example.com/file.pdf')

      expect(result).toBe(false)
    })
  })
})

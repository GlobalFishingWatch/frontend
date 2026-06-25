import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createCookieTokenStorage } from './utils/token-storage'
import { GFW_API_CLASS } from './api-client'
import { API_GATEWAY, API_VERSION } from './config'

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

describe('api-client', () => {
  const createApiClient = (overrides: ConstructorParameters<typeof GFW_API_CLASS>[0] = {}) =>
    new GFW_API_CLASS({
      debug: false,
      baseUrl: 'https://api.example.com',
      version: 'v3',
      ...overrides,
    })

  beforeEach(() => {
    const storage: Record<string, string> = {}
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value
      },
      removeItem: (key: string) => {
        delete storage[key]
      },
      clear: () => {
        Object.keys(storage).forEach((k) => delete storage[k])
      },
      length: 0,
      key: () => null,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('GFW_API_CLASS', () => {
    describe('constructor', () => {
      it('should initialize with default config', () => {
        const client = createApiClient()

        expect(client.baseUrl).toBe('https://api.example.com')
        expect(client.apiVersion).toBe('v3')
        expect(client.debug).toBe(false)
        expect(client.status).toBe('idle')
      })

      it('should use custom baseUrl and version', () => {
        const client = createApiClient({
          baseUrl: 'https://custom.api.com',
          version: 'v2',
        })

        expect(client.baseUrl).toBe('https://custom.api.com')
        expect(client.apiVersion).toBe('v2')
      })

      it('should log config when debug is true', () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

        createApiClient({ debug: true })

        expect(logSpy).toHaveBeenCalledWith(
          'GFWAPI: GFW API Client initialized with the following config',
          expect.any(Object)
        )
        logSpy.mockRestore()
      })
    })

    describe('getConfig', () => {
      it('should return config with debug, baseUrl, storageKeys, token, refreshToken', () => {
        const client = createApiClient()

        const config = client.getConfig()

        expect(config).toHaveProperty('debug')
        expect(config).toHaveProperty('baseUrl')
        expect(config).toHaveProperty('storageKeys')
        expect(config).toHaveProperty('token')
        expect(config).toHaveProperty('refreshToken')
        expect(config.baseUrl).toBe('https://api.example.com')
        expect(config.storageKeys).toHaveProperty('token')
        expect(config.storageKeys).toHaveProperty('refreshToken')
      })
    })

    describe('generateUrl', () => {
      it('should return absolute URL unchanged', () => {
        const client = createApiClient()
        const url = 'https://external.com/path'

        expect(client.generateUrl(url)).toBe(url)
        expect(client.generateUrl(url, { absolute: true })).toBe(url)
      })

      it('should prefix relative URL with version when absolute', () => {
        const client = createApiClient()

        const result = client.generateUrl('/datasets', { absolute: true })

        expect(result).toBe('https://api.example.com/v3/datasets')
      })

      it('should return relative path with version prefix when not absolute', () => {
        const client = createApiClient()

        const result = client.generateUrl('/datasets')

        expect(result).toBe('/v3/datasets')
      })

      it('should use custom version when provided', () => {
        const client = createApiClient()

        const result = client.generateUrl('/datasets', {
          absolute: true,
          version: 'v2',
        })

        expect(result).toBe('https://api.example.com/v2/datasets')
      })

      it('should not double-prefix URL that already starts with version', () => {
        const client = createApiClient()
        const url = '/v3/auth/me'

        const result = client.generateUrl(url, { absolute: true })

        expect(result).toBe('https://api.example.com/v3/auth/me')
      })

      it('should return path as-is for version-prefixed URL when not absolute', () => {
        const client = createApiClient()
        const url = '/v3/auth/me'

        const result = client.generateUrl(url)

        expect(result).toBe(url)
      })

      it('should handle empty version', () => {
        const client = createApiClient({ version: '' })

        const result = client.generateUrl('/datasets', { absolute: true })

        expect(result).toBe('https://api.example.com/datasets')
      })
    })

    describe('getLoginUrl', () => {
      it('should return URL with callback and client params', () => {
        const client = createApiClient()

        const result = client.getLoginUrl('https://app.com/callback')

        expect(result).toContain('callback=https%3A%2F%2Fapp.com%2Fcallback')
        expect(result).toContain('client=gfw')
        expect(result).toContain('auth')
        expect(result).toContain(API_VERSION)
      })

      it('should use custom client and locale when provided', () => {
        const client = createApiClient()

        const result = client.getLoginUrl('https://app.com/cb', {
          client: 'custom',
          locale: 'es',
        })

        expect(result).toContain('client=custom')
        expect(result).toContain('locale=es')
      })

      it('should use locale from localStorage when not provided', () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('i18nextLng', 'fr')

        const result = client.getLoginUrl('https://app.com/cb', { locale: '' })

        expect(result).toContain('locale=fr')
      })
    })

    describe('getRegisterUrl', () => {
      it('should return URL with callback and registration path', () => {
        const client = createApiClient()

        const result = client.getRegisterUrl('https://app.com/callback')

        expect(result).toContain('callback=')
        expect(result).toContain('registration')
        expect(result).toContain('auth')
      })

      it('should use locale from localStorage when not provided', () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('i18nextLng', 'es')

        const result = client.getRegisterUrl('https://app.com/cb', { locale: '' })

        expect(result).toContain('locale=es')
      })
    })

    describe('fetch', () => {
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      afterEach(() => {
        vi.unstubAllGlobals()
      })

      it('should return JSON response when fetch succeeds', async () => {
        const client = createApiClient()
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

      it('should re-read function headers on each attempt (no stale capture across retry)', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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
            'x-refresh': storage.getItem('GFW_API_USER_REFRESH_TOKEN'),
          }),
        })

        // First attempt sends the original token, the retry re-reads the rotated one.
        expect(fetchMock.mock.calls[0][1].headers['x-refresh']).toBe('refresh-A')
        expect(fetchMock.mock.calls[2][1].headers['x-refresh']).toBe('refresh-B')
      })

      it('should pass body and method for POST', async () => {
        const client = createApiClient()
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

      it('should throw parsed error on 4xx response', async () => {
        const client = createApiClient()
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

      it('should use custom version from options', async () => {
        const client = createApiClient()
        fetchMock.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))

        await client.fetch('/datasets', { version: 'v2' })

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/v2/'), expect.any(Object))
      })

      it('should return blob for responseType blob', async () => {
        const client = createApiClient()
        const blob = new Blob(['data'])
        const response = new Response(null, { status: 200 })
        vi.spyOn(response, 'blob').mockResolvedValue(blob)
        fetchMock.mockResolvedValue(response)

        const result = await client.fetch<Blob>('/file', { responseType: 'blob' })

        expect(result).toBe(blob)
      })

      it('should return text for responseType text', async () => {
        const client = createApiClient()
        fetchMock.mockResolvedValue(new Response('plain text', { status: 200 }))

        const result = await client.fetch<string>('/file', { responseType: 'text' })

        expect(result).toBe('plain text')
      })

      it('should return undefined for 204 No Content', async () => {
        const client = createApiClient()
        fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

        const result = await client.fetch('/endpoint')

        expect(result).toBeUndefined()
      })

      it('should return raw response for responseType default', async () => {
        const client = createApiClient()
        const response = new Response('ok', { status: 200 })
        fetchMock.mockResolvedValue(response)

        const result = await client.fetch<Response>('/endpoint', {
          responseType: 'default',
        })

        expect(result).toBe(response)
      })

      it('should return arrayBuffer for responseType arrayBuffer', async () => {
        const client = createApiClient()
        const buffer = new ArrayBuffer(8)
        fetchMock.mockResolvedValue(new Response(buffer, { status: 200 }))

        const result = await client.fetch<ArrayBuffer>('/binary', {
          responseType: 'arrayBuffer',
        })

        expect(result).toBeInstanceOf(ArrayBuffer)
        expect((result as ArrayBuffer).byteLength).toBe(8)
      })

      it('should return vessel data for responseType vessel', async () => {
        const client = createApiClient()
        fetchMock.mockResolvedValue(new Response(new Uint8Array(0).buffer, { status: 200 }))

        const result = await client.fetch<number[]>('/vessels/track', {
          responseType: 'vessel',
        })

        expect(result).toEqual([])
      })

      it('should include local headers when local option is true', async () => {
        const client = createApiClient()
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

      it('should retry on 401 after refreshing token', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

      it('should share one token refresh across concurrent auth retries', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

        await expect(Promise.all([request1, request2])).resolves.toEqual([
          { ok: true },
          { ok: true },
        ])
        const refreshCalls = fetchMock.mock.calls.filter(([url]) =>
          String(url).includes('/auth/tokens/reload')
        )
        const retriedCalls = fetchMock.mock.calls.filter(([, options]) => {
          return options.headers.Authorization === 'Bearer new-token'
        })
        expect(refreshCalls).toHaveLength(1)
        expect(retriedCalls).toHaveLength(2)
      })

      it('should retry on 500', async () => {
        const client = createApiClient()
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

      it('should clear tokens and throw when refresh fails on 401', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

      it('should NOT wipe tokens when the refresh is rejected with 403 (forbidden, not invalid token)', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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
        const error = await client.fetch('/datasets/1').catch((e) => e)
        expect(error.refreshError).toBeUndefined()
        // A 403 is "authenticated but forbidden", not "invalid refresh token" — keep the session.
        expect(storage.getItem('GFW_API_USER_TOKEN')).toBe('old-token')
        expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBe('refresh-token')
      })

      it('should throw raw error for responseType default on 4xx', async () => {
        const client = createApiClient()
        const errorResponse = new Response(JSON.stringify({ message: 'Not found' }), {
          status: 404,
          statusText: 'Not Found',
        })
        fetchMock.mockResolvedValue(errorResponse)

        await expect(client.fetch('/datasets', { responseType: 'default' })).rejects.toBe(
          errorResponse
        )
      })

      it('should continue fetch after login rejects when logging is in progress', async () => {
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
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      it('should download file and return true', async () => {
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

      it('should return false when download fails', async () => {
        const client = createApiClient()
        fetchMock.mockRejectedValue(new Error('Network error'))

        const result = await client.download('https://example.com/file.pdf')

        expect(result).toBe(false)
      })
    })

    describe('refreshAPIToken', () => {
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      it('should throw when no refresh token', async () => {
        const client = createApiClient()

        await expect(client.refreshAPIToken()).rejects.toThrow('No refresh token')
      })

      it('should refresh token and update storage', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

      it('should throw with status 401 when refresh fails', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'invalid-refresh')

        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ message: 'Invalid' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )

        await expect(client.refreshAPIToken()).rejects.toMatchObject({ status: 401 })
      })

      it('should return the active refresh when already refreshing', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

      it('should retry with the latest refresh token when storage changed in another tab', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it('should retry the reload on a transient 5xx failure', async () => {
        vi.useFakeTimers()
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

      it('should retry the reload on a transient network failure', async () => {
        vi.useFakeTimers()
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

      it('should give up after maxReloadRetries transient failures', async () => {
        vi.useFakeTimers()
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

      it('should NOT retry the reload on a 401 (invalid refresh token)', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      afterEach(() => {
        vi.unstubAllGlobals()
      })

      it('should run the refresh inside the Web Lock when available', async () => {
        const requestSpy = vi.fn((_name: string, cb: () => Promise<unknown>) => cb())
        vi.stubGlobal('navigator', { locks: { request: requestSpy } })

        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

        fetchMock.mockResolvedValueOnce(
          new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
            status: 200,
          })
        )

        await client.refreshAPIToken()

        expect(requestSpy).toHaveBeenCalledWith('gfw-token-refresh', expect.any(Function))
      })

      it('should skip the network call when another tab already rotated the token', async () => {
        const storage = (globalThis as any).localStorage as any
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

    describe('fetchUser', () => {
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      it('should return user data', async () => {
        const client = createApiClient()
        const user = { id: 1, type: 'user', permissions: [], groups: [] }
        fetchMock.mockResolvedValue(new Response(JSON.stringify(user), { status: 200 }))

        const result = await client.fetchUser()

        expect(result).toEqual(user)
      })

      it('should throw on error', async () => {
        const client = createApiClient()
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )

        await expect(client.fetchUser()).rejects.toThrow('Error trying to get user data')
      })
    })

    describe('fetchGuestUser', () => {
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      it('should return guest user with permissions', async () => {
        const client = createApiClient()
        const permissions = [{ id: 'perm1', name: 'read' }]
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ entries: permissions }), { status: 200 })
        )

        const result = await client.fetchGuestUser()

        expect(result).toEqual({
          id: 0,
          type: 'guest',
          permissions,
          groups: [],
        })
      })

      it('should throw on error', async () => {
        const client = createApiClient()
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ message: 'Error' }), {
            status: 500,
            statusText: 'Server Error',
          })
        )

        await expect(client.fetchGuestUser()).rejects.toThrow('Error trying to get user data')
      })
    })

    describe('login', () => {
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      it('should login with access token', async () => {
        const client = createApiClient()
        const user = { id: 1, type: 'user', permissions: [], groups: [] }
        fetchMock
          .mockResolvedValueOnce(
            new Response(JSON.stringify({ token: 'jwt', refreshToken: 'refresh' }), { status: 200 })
          )
          .mockResolvedValueOnce(new Response(JSON.stringify(user), { status: 200 }))

        const result = await client.login({ accessToken: 'oauth-token' })

        expect(result).toEqual(user)
      })

      it('should login with refresh token', async () => {
        const client = createApiClient()
        const user = { id: 1, type: 'user', permissions: [], groups: [] }
        fetchMock
          .mockResolvedValueOnce(
            new Response(JSON.stringify({ token: 'jwt', refreshToken: 'refresh' }), { status: 200 })
          )
          .mockResolvedValueOnce(new Response(JSON.stringify(user), { status: 200 }))

        const result = await client.login({ refreshToken: 'my-refresh-token' })

        expect(result).toEqual(user)
      })

      it('should reject when no token provided', async () => {
        const client = createApiClient()

        await expect(client.login({})).rejects.toThrow('No login token provided')
      })

      it('should reject when access token is invalid', async () => {
        const client = createApiClient()
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ message: 'Invalid' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )

        await expect(client.login({ accessToken: 'invalid' })).rejects.toThrow(
          'Invalid access token'
        )
      })

      it('should use existing token when access token fails but tokens in storage', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'valid-token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

        const user = { id: 1, type: 'user', permissions: [], groups: [] }
        fetchMock
          .mockResolvedValueOnce(
            new Response(JSON.stringify({ message: 'Invalid' }), {
              status: 401,
              statusText: 'Unauthorized',
            })
          )
          .mockResolvedValueOnce(new Response(JSON.stringify(user), { status: 200 }))

        const result = await client.login({ accessToken: 'invalid-oauth' })

        expect(result).toEqual(user)
      })

      it('should reject when refresh token is invalid', async () => {
        const client = createApiClient()
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ message: 'Invalid' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )

        await expect(client.login({ refreshToken: 'invalid' })).rejects.toThrow(
          'Invalid refresh token'
        )
      })

      it('should login with existing token in storage', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'valid-token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

        const user = { id: 1, type: 'user', permissions: [], groups: [] }
        fetchMock.mockResolvedValue(new Response(JSON.stringify(user), { status: 200 }))

        const result = await client.login({})

        expect(result).toEqual(user)
        expect(fetchMock).toHaveBeenCalledTimes(1)
      })

      it('should login when token expired but refresh succeeds', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'expired-token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'valid-refresh')

        const user = { id: 1, type: 'user', permissions: [], groups: [] }
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
          .mockResolvedValueOnce(new Response(JSON.stringify(user), { status: 200 }))

        const result = await client.login({})

        expect(result).toEqual(user)
      })

      it('should use the latest storage refresh token after existing token fails', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'expired-token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'old-refresh')
        const user = { id: 1, type: 'user', permissions: [], groups: [] }

        fetchMock
          .mockImplementationOnce(() => {
            storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'latest-refresh')
            return Promise.resolve(
              new Response(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401,
                statusText: 'Unauthorized',
              })
            )
          })
          .mockImplementationOnce((_url, options) => {
            expect(options.headers['refresh-token']).toBe('latest-refresh')
            return Promise.resolve(
              new Response(JSON.stringify({ token: 'new-token', refreshToken: 'new-refresh' }), {
                status: 200,
              })
            )
          })
          .mockResolvedValueOnce(new Response(JSON.stringify(user), { status: 200 }))

        const result = await client.login({})

        expect(result).toEqual(user)
      })

      it('should login via refreshStrategy when access token is expired in cookie', async () => {
        let jar = 'GFW_API_USER_TOKEN=expired-token'
        vi.stubGlobal('document', {
          get cookie() {
            return jar
          },
          set cookie(value: string) {
            jar = value.split(';')[0]
          },
        })
        const client = createApiClient()
        const user = { id: 1, type: 'user', permissions: [], groups: [] }
        const refreshStrategy = vi.fn(async () => {
          jar = 'GFW_API_USER_TOKEN=new-token'
          return { token: 'new-token', refreshToken: 'new-refresh' }
        })
        client.configure({
          tokenStorage: createCookieTokenStorage('GFW_API_USER_TOKEN'),
          refreshStrategy,
        })

        fetchMock
          .mockResolvedValueOnce(
            new Response(JSON.stringify({ message: 'Unauthorized' }), {
              status: 401,
              statusText: 'Unauthorized',
            })
          )
          .mockResolvedValueOnce(new Response(JSON.stringify(user), { status: 200 }))

        const result = await client.login({})

        expect(result).toEqual(user)
        expect(refreshStrategy).toHaveBeenCalledTimes(1)
      })

      it('should not call refreshStrategy on login when there is no session (post-logout)', async () => {
        let jar = ''
        vi.stubGlobal('document', {
          get cookie() {
            return jar
          },
          set cookie(value: string) {
            jar = value.split(';')[0]
          },
        })
        const client = createApiClient()
        const refreshStrategy = vi.fn()
        client.configure({
          tokenStorage: createCookieTokenStorage('GFW_API_USER_TOKEN'),
          refreshStrategy,
        })

        await expect(client.login({})).rejects.toThrow('No login token provided')
        expect(refreshStrategy).not.toHaveBeenCalled()
      })
    })

    describe('logout', () => {
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      it('should clear tokens on success', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')

        fetchMock.mockResolvedValue(new Response(null, { status: 200 }))

        const result = await client.logout()

        expect(result).toBe(true)
        expect(storage.getItem('GFW_API_USER_TOKEN')).toBeNull()
        expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBeNull()
      })

      it('should call sessionInvalidateStrategy when clearing the session', async () => {
        const client = createApiClient()
        const sessionInvalidateStrategy = vi.fn()
        client.configure({ sessionInvalidateStrategy })
        fetchMock.mockResolvedValue(new Response(null, { status: 200 }))

        await client.logout()

        expect(sessionInvalidateStrategy).toHaveBeenCalledTimes(1)
      })

      it('should clear tokens even when API fails', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')

        fetchMock.mockRejectedValue(new Error('Network error'))

        await expect(client.logout()).rejects.toThrow('Error on the logout proccess')
        expect(storage.getItem('GFW_API_USER_TOKEN')).toBeNull()
        expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBeNull()
      })

      it('should not refresh or retry on a 401 (single request) and clear tokens', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')

        fetchMock.mockResolvedValue(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            statusText: 'Unauthorized',
          })
        )

        await expect(client.logout()).rejects.toThrow('Error on the logout proccess')
        // skipAuthRefresh: no /tokens/reload call, no retry — exactly one request.
        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(storage.getItem('GFW_API_USER_TOKEN')).toBeNull()
        expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBeNull()
      })

      it('should send the current refresh token (re-read), not a stale one', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-A')

        fetchMock.mockResolvedValue(new Response(null, { status: 200 }))

        await client.logout()

        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('logout'),
          expect.objectContaining({
            headers: expect.objectContaining({ 'refresh-token': 'refresh-A' }),
          })
        )
      })

      it('should log when debug is true', async () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const client = createApiClient({ debug: true })
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')

        fetchMock.mockResolvedValue(new Response(null, { status: 200 }))

        await client.logout()

        expect(logSpy).toHaveBeenCalledWith('GFWAPI: logout — gateway OK')
        expect(logSpy).toHaveBeenCalledWith('GFWAPI: invalidateClientSession — clearing local session')
        logSpy.mockRestore()
        warnSpy.mockRestore()
      })

      it('should log warn when logout API fails', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const client = createApiClient({ debug: true })
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'token')
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')

        fetchMock.mockRejectedValue(new Error('Network error'))

        await expect(client.logout()).rejects.toThrow('Error on the logout proccess')
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('logout — gateway call failed'),
          expect.anything()
        )
        warnSpy.mockRestore()
      })
    })

    describe('configure / SSR auth model', () => {
      let fetchMock: ReturnType<typeof vi.fn>

      beforeEach(() => {
        fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
      })

      it('should use a per-request token for the bearer without touching the stored token', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
        storage.setItem('GFW_API_USER_TOKEN', 'stored-token')
        fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))

        await client.fetch('/protected', { token: 'per-request-token' })

        expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer per-request-token')
        // The shared singleton's token must be untouched (no cross-request leak).
        expect(storage.getItem('GFW_API_USER_TOKEN')).toBe('stored-token')
        expect(client.token).toBe('stored-token')
      })

      it('should NOT refresh or retry on a 401 when a per-request token is used (single request)', async () => {
        const client = createApiClient()
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

      it('should refresh via the configured strategy (not /tokens/reload) and retry with the rotated token', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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
      it('should share one refresh-strategy call across concurrent auth retries (dedup)', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

        await expect(Promise.all([request1, request2])).resolves.toEqual([
          { ok: true },
          { ok: true },
        ])
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
      it('should propagate a rejected strategy refresh as a 401 (no infinite retry)', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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

      it('should call sessionInvalidateStrategy when refresh is rejected with 401', async () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as any
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
      it('ignores localStorage for the refresh token when a refreshStrategy is configured', () => {
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as Storage
        storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'stale-localstorage-refresh')
        client.configure({ refreshStrategy: async () => ({ token: 't', refreshToken: 'r' }) })

        // The strategy owns the refresh token — the client must not surface the stale local one.
        expect(client.refreshToken).toBe('')
      })
    })

    describe('legacy localStorage defaults (no configure)', () => {
      it('reads tokens from localStorage and clears them on logout', async () => {
        const fetchMock = vi.fn(
          async () => new Response(JSON.stringify({ ok: true }), { status: 200 })
        )
        vi.stubGlobal('fetch', fetchMock)
        const client = createApiClient()
        const storage = (globalThis as any).localStorage as Storage
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

  describe('exports', () => {
    it('should export API_GATEWAY and API_VERSION from config', () => {
      expect(API_GATEWAY).toBeDefined()
      expect(typeof API_GATEWAY).toBe('string')
      expect(API_VERSION).toBeDefined()
      expect(['v1', 'v2', 'v3']).toContain(API_VERSION)
    })
  })

  describe('createCookieTokenStorage', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should read and write a JS-readable cookie on the client', () => {
      let jar = ''
      vi.stubGlobal('document', {
        get cookie() {
          return jar
        },
        set cookie(value: string) {
          jar = value.split(';')[0]
        },
      })
      const storage = createCookieTokenStorage('GFW_API_USER_TOKEN')

      storage.set('abc123')
      expect(storage.get()).toBe('abc123')
    })

    it('should be SSR-safe: return empty and not throw without document', () => {
      vi.stubGlobal('document', undefined)
      const storage = createCookieTokenStorage('GFW_API_USER_TOKEN')

      expect(() => storage.set('abc123')).not.toThrow()
      expect(storage.get()).toBe('')
    })
  })
})

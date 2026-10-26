import { describe, expect, vi } from 'vitest'

import { createCookieTokenStorage } from '../utils/token-storage'

import { createApiClient, it, stubCookieDocument } from './helpers'

describe('GFW_API_CLASS', () => {
  describe('fetchUser', () => {
    it('should return user data', async ({ client, fetchMock }) => {
      const user = { id: 1, type: 'user', permissions: [], groups: [] }
      fetchMock.mockResolvedValue(new Response(JSON.stringify(user), { status: 200 }))

      const result = await client.fetchUser()

      expect(result).toEqual(user)
    })

    it('should throw on error', async ({ client, fetchMock }) => {
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
    it('should return guest user with permissions', async ({ client, fetchMock }) => {
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

    it('should throw on error', async ({ client, fetchMock }) => {
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
    it('should login with access token', async ({ client, fetchMock }) => {
      const user = { id: 1, type: 'user', permissions: [], groups: [] }
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ token: 'jwt', refreshToken: 'refresh' }), { status: 200 })
        )
        .mockResolvedValueOnce(new Response(JSON.stringify(user), { status: 200 }))

      const result = await client.login({ accessToken: 'oauth-token' })

      expect(result).toEqual(user)
    })

    it('should login with refresh token', async ({ client, fetchMock }) => {
      const user = { id: 1, type: 'user', permissions: [], groups: [] }
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ token: 'jwt', refreshToken: 'refresh' }), { status: 200 })
        )
        .mockResolvedValueOnce(new Response(JSON.stringify(user), { status: 200 }))

      const result = await client.login({ refreshToken: 'my-refresh-token' })

      expect(result).toEqual(user)
    })

    it('should reject when no token provided', async ({ client }) => {
      await expect(client.login({})).rejects.toThrow('No login token provided')
    })

    it('should reject when access token is invalid', async ({ client, fetchMock }) => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Invalid' }), {
          status: 401,
          statusText: 'Unauthorized',
        })
      )

      await expect(client.login({ accessToken: 'invalid' })).rejects.toThrow('Invalid access token')
    })

    it('should use existing token when access token fails but tokens in storage', async ({
      client,
      fetchMock,
      storage,
    }) => {
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

    it('should reject when refresh token is invalid', async ({ client, fetchMock }) => {
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

    it('should login with existing token in storage', async ({ client, fetchMock, storage }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'valid-token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh-token')

      const user = { id: 1, type: 'user', permissions: [], groups: [] }
      fetchMock.mockResolvedValue(new Response(JSON.stringify(user), { status: 200 }))

      const result = await client.login({})

      expect(result).toEqual(user)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should login when token expired but refresh succeeds', async ({
      client,
      fetchMock,
      storage,
    }) => {
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

    it('should use the latest storage refresh token after existing token fails', async ({
      client,
      fetchMock,
      storage,
    }) => {
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

    it('should login via refreshStrategy when access token is expired in cookie', async ({
      fetchMock,
    }) => {
      stubCookieDocument('GFW_API_USER_TOKEN=expired-token')
      const client = createApiClient()
      const user = { id: 1, type: 'user', permissions: [], groups: [] }
      const refreshStrategy = vi.fn(async () => {
        document.cookie = 'GFW_API_USER_TOKEN=new-token'
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
      stubCookieDocument()
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
    it('should clear tokens on success', async ({ client, fetchMock, storage }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')

      fetchMock.mockResolvedValue(new Response(null, { status: 200 }))

      const result = await client.logout()

      expect(result).toBe(true)
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBeNull()
      expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBeNull()
    })

    it('should call sessionInvalidateStrategy when clearing the session', async ({
      client,
      fetchMock,
    }) => {
      const sessionInvalidateStrategy = vi.fn()
      client.configure({ sessionInvalidateStrategy })
      fetchMock.mockResolvedValue(new Response(null, { status: 200 }))

      await client.logout()

      expect(sessionInvalidateStrategy).toHaveBeenCalledTimes(1)
    })

    it('should clear tokens even when API fails', async ({ client, fetchMock, storage }) => {
      storage.setItem('GFW_API_USER_TOKEN', 'token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')

      fetchMock.mockRejectedValue(new Error('Network error'))

      await expect(client.logout()).rejects.toThrow('Error on the logout proccess')
      expect(storage.getItem('GFW_API_USER_TOKEN')).toBeNull()
      expect(storage.getItem('GFW_API_USER_REFRESH_TOKEN')).toBeNull()
    })

    it('should not refresh or retry on a 401 (single request) and clear tokens', async ({
      client,
      fetchMock,
      storage,
    }) => {
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

    it('should send the current refresh token (re-read), not a stale one', async ({
      client,
      fetchMock,
      storage,
    }) => {
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

    it('should log when debug is true', async ({ fetchMock, storage }) => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const client = createApiClient({ debug: true })
      storage.setItem('GFW_API_USER_TOKEN', 'token')
      storage.setItem('GFW_API_USER_REFRESH_TOKEN', 'refresh')

      fetchMock.mockResolvedValue(new Response(null, { status: 200 }))

      await client.logout()

      expect(logSpy).toHaveBeenCalledWith('GFWAPI: logout — gateway OK')
      expect(logSpy).toHaveBeenCalledWith(
        'GFWAPI: invalidateClientSession — clearing local session'
      )
      logSpy.mockRestore()
      warnSpy.mockRestore()
    })

    it('should log warn when logout API fails', async ({ fetchMock, storage }) => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const client = createApiClient({ debug: true })
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
})

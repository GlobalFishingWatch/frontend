import { describe, expect, vi } from 'vitest'

import type { ApiVersion } from '../api-client'
import { API_GATEWAY, API_VERSION } from '../config'

import { createApiClient, it } from './helpers'

describe('GFW_API_CLASS', () => {
  describe('constructor', () => {
    it('should initialize with default config', ({ client }) => {
      expect(client.baseUrl).toBe('https://api.example.com')
      expect(client.apiVersion).toBe('v3')
      expect(client.debug).toBe(false)
      expect(client.status).toBe('idle')
    })

    it('should use custom baseUrl and version', () => {
      const client = createApiClient({
        baseUrl: 'https://custom.api.com',
        version: 'v2' as ApiVersion,
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
    it('should return config with debug, baseUrl, storageKeys, token, refreshToken', ({
      client,
    }) => {
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
    it('should return absolute URL unchanged', ({ client }) => {
      const url = 'https://external.com/path'

      expect(client.generateUrl(url)).toBe(url)
      expect(client.generateUrl(url, { absolute: true })).toBe(url)
    })

    it('should prefix relative URL with version when absolute', ({ client }) => {
      const result = client.generateUrl('/datasets', { absolute: true })

      expect(result).toBe('https://api.example.com/v3/datasets')
    })

    it('should return relative path with version prefix when not absolute', ({ client }) => {
      const result = client.generateUrl('/datasets')

      expect(result).toBe('/v3/datasets')
    })

    it('should use custom version when provided', ({ client }) => {
      const result = client.generateUrl('/datasets', {
        absolute: true,
        version: 'v2' as ApiVersion,
      })

      expect(result).toBe('https://api.example.com/v2/datasets')
    })

    it('should not double-prefix URL that already starts with version', ({ client }) => {
      const url = '/v3/auth/me'

      const result = client.generateUrl(url, { absolute: true })

      expect(result).toBe('https://api.example.com/v3/auth/me')
    })

    it('should return path as-is for version-prefixed URL when not absolute', ({ client }) => {
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
    it('should return URL with callback and client params', ({ client }) => {
      const result = client.getLoginUrl('https://app.com/callback')

      expect(result).toContain('callback=https%3A%2F%2Fapp.com%2Fcallback')
      expect(result).toContain('client=gfw')
      expect(result).toContain('auth')
      expect(result).toContain(API_VERSION)
    })

    it('should use custom client and locale when provided', ({ client }) => {
      const result = client.getLoginUrl('https://app.com/cb', {
        client: 'custom',
        locale: 'es',
      })

      expect(result).toContain('client=custom')
      expect(result).toContain('locale=es')
    })

    it('should use locale from localStorage when not provided', ({ client, storage }) => {
      storage.setItem('i18nextLng', 'fr')

      const result = client.getLoginUrl('https://app.com/cb', { locale: '' })

      expect(result).toContain('locale=fr')
    })
  })

  describe('getRegisterUrl', () => {
    it('should return URL with callback and registration path', ({ client }) => {
      const result = client.getRegisterUrl('https://app.com/callback')

      expect(result).toContain('callback=')
      expect(result).toContain('registration')
      expect(result).toContain('auth')
    })

    it('should use locale from localStorage when not provided', ({ client, storage }) => {
      storage.setItem('i18nextLng', 'es')

      const result = client.getRegisterUrl('https://app.com/cb', { locale: '' })

      expect(result).toContain('locale=es')
    })

    it('should fall back to en when localStorage is unavailable', ({ client, storage }) => {
      // Android WebViews with DOM storage disabled expose a null localStorage
      vi.stubGlobal('localStorage', null)

      try {
        expect(client.getRegisterUrl('https://app.com/cb', { locale: '' })).toContain('locale=en')
      } finally {
        vi.stubGlobal('localStorage', storage)
      }
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

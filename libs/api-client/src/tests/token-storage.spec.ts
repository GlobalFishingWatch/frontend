import { describe, expect, vi } from 'vitest'

import { createCookieTokenStorage } from '../utils/token-storage'

import { it, stubCookieDocument } from './helpers'

describe('createCookieTokenStorage', () => {
  it('should read and write a JS-readable cookie on the client', () => {
    stubCookieDocument()
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

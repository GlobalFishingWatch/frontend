import { describe, expect } from 'vitest'

import { getTokenExpiry } from '../utils/token-storage'

import { it } from './helpers'

// Unpadded base64url, like real JWTs: `ü` makes the payload need both `-`/`_` and padding
const jwt = (payload: object) =>
  `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`

const nowInSeconds = () => Math.floor(Date.now() / 1000)

describe('getTokenExpiry', () => {
  it('reads exp from a base64url payload', () => {
    expect(getTokenExpiry(jwt({ exp: 1795464940, name: 'Jürgen?>' }))).toBe(1795464940)
  })

  it('is undefined for anything that is not a JWT with a numeric exp', () => {
    expect(getTokenExpiry('')).toBeUndefined()
    expect(getTokenExpiry('opaque-token')).toBeUndefined()
    expect(getTokenExpiry('a.not-base64!.c')).toBeUndefined()
    expect(getTokenExpiry(jwt({ exp: '1795464940' }))).toBeUndefined()
  })
})

describe('isTokenExpired', () => {
  it('is false without a token or a readable exp', ({ client, storage }) => {
    expect(client.isTokenExpired()).toBe(false)
    storage.setItem('GFW_API_USER_TOKEN', 'opaque-token')
    expect(client.isTokenExpired()).toBe(false)
  })

  it('is true past exp and within the margin, false before it', ({ client, storage }) => {
    storage.setItem('GFW_API_USER_TOKEN', jwt({ exp: nowInSeconds() - 1 }))
    expect(client.isTokenExpired()).toBe(true)

    storage.setItem('GFW_API_USER_TOKEN', jwt({ exp: nowInSeconds() + 30 }))
    expect(client.isTokenExpired()).toBe(true)
    expect(client.isTokenExpired(0)).toBe(false)

    storage.setItem('GFW_API_USER_TOKEN', jwt({ exp: nowInSeconds() + 30 * 60 }))
    expect(client.isTokenExpired()).toBe(false)
  })
})

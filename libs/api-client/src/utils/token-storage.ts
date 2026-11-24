import { safeLocalStorage } from './browser'
import { readDocumentCookie, removeDocumentCookie, writeDocumentCookie } from './cookies'

export interface TokenStorage {
  get(): string
  set(value: string): void
}

/** `exp` claim (seconds) of a JWT, read without verifying it. Undefined when it is not readable */
export const getTokenExpiry = (token: string): number | undefined => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' ? exp : undefined
  } catch {
    return undefined
  }
}

export const createLocalStorageTokenStorage = (key: string): TokenStorage => ({
  get: () => safeLocalStorage.get(key) || '',
  set: (value: string) => {
    if (value) {
      safeLocalStorage.set(key, value)
    } else {
      safeLocalStorage.remove(key)
    }
  },
})

export const createCookieTokenStorage = (key: string): TokenStorage => ({
  get: () => (typeof document === 'undefined' ? '' : readDocumentCookie({ key }) || ''),
  set: (value: string) => {
    if (typeof document === 'undefined') return
    if (value) {
      writeDocumentCookie(key, value)
    } else {
      removeDocumentCookie(key)
    }
  },
})

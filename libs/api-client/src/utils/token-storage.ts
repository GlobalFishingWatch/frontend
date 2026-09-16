import { safeLocalStorage } from './browser'
import { readDocumentCookie, removeDocumentCookie, writeDocumentCookie } from './cookies'

export interface TokenStorage {
  get(): string
  set(value: string): void
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

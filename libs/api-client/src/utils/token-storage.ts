import { getIsBrowser } from './browser'
import { readDocumentCookie, removeDocumentCookie, writeDocumentCookie } from './cookies'

export interface TokenStorage {
  get(): string
  set(value: string): void
}

export const createLocalStorageTokenStorage = (key: string): TokenStorage => ({
  get: () => (getIsBrowser() ? localStorage.getItem(key) || '' : ''),
  set: (value: string) => {
    if (getIsBrowser()) {
      if (value) {
        localStorage.setItem(key, value)
      } else {
        localStorage.removeItem(key)
      }
    }
  },
})

export const createCookieTokenStorage = (key: string): TokenStorage => ({
  get: () => readDocumentCookie({ key }) || '',
  set: (value: string) => {
    if (typeof document === 'undefined') return
    if (value) {
      writeDocumentCookie(key, value)
    } else {
      removeDocumentCookie(key)
    }
  },
})

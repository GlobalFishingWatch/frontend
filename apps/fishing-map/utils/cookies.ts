import { useCallback } from 'react'

import { getIsBrowser } from 'utils/dom'

export function readDocumentCookieString(key: string): string | null {
  const match = getIsBrowser()
    ? document.cookie.match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`))
    : null
  return match?.[1] ?? null
}

export function readRequestCookieString(cookieHeader: string, key: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function readDocumentCookieNumber(key: string): number | null {
  const stringMatch = readDocumentCookieString(key)
  if (stringMatch === null) return null
  const parsed = parseFloat(stringMatch)
  return Number.isNaN(parsed) ? null : parsed
}

const COOKIE_MAX_AGE_1_YEAR = 60 * 60 * 24 * 365

export function writeDocumentCookie(
  key: string,
  value: string | number,
  maxAge = COOKIE_MAX_AGE_1_YEAR
) {
  if (!getIsBrowser()) return
  document.cookie = `${key}=${value};path=/;max-age=${maxAge};samesite=lax`
}

export function usePersistedCookieNumber(cookieKey: string) {
  return useCallback(
    (value: number) => {
      writeDocumentCookie(cookieKey, value)
    },
    [cookieKey]
  )
}

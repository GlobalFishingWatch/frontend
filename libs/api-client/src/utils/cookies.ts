/**
 * Cookie utility functions for secure token storage
 */

interface CookieOptions {
  expires?: Date
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  httpOnly?: boolean
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') {
    return // Server-side rendering
  }

  const {
    expires,
    maxAge,
    domain,
    path = '/',
    secure = true,
    sameSite = 'lax',
    httpOnly = false,
  } = options

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`
  }

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (path) {
    cookieString += `; path=${path}`
  }

  if (secure) {
    cookieString += `; secure`
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`
  }

  if (httpOnly) {
    cookieString += `; httponly`
  }

  document.cookie = cookieString
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null // Server-side rendering
  }

  const nameEQ = `${encodeURIComponent(name)}=`
  const cookies = document.cookie.split(';')

  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }

  return null
}

/**
 * Remove a cookie by setting it to expire in the past
 */
export function removeCookie(
  name: string,
  options: Pick<CookieOptions, 'domain' | 'path'> = {}
): void {
  if (typeof document === 'undefined') {
    return // Server-side rendering
  }

  const { domain, path = '/' } = options

  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (path) {
    cookieString += `; path=${path}`
  }

  document.cookie = cookieString
}

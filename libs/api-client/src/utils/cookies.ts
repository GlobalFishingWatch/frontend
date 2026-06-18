export const getIsBrowser = () => typeof window !== 'undefined'

export function readCookieString(cookieHeader: string, key: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

type CookieType = 'string' | 'number' | 'object'
type NumberCookieArgs = { key: string; type: 'number' }
type ObjectCookieArgs = { key: string; type: 'object' }
type StringCookieArgs = { key: string; type?: 'string' }
type ReadCookieArgs = { key: string; type?: CookieType }

function parseCookieValue<T>(
  cookie: string,
  key: string,
  type: CookieType
): string | number | T | null {
  const raw = readCookieString(cookie, key)
  if (type === 'number') {
    if (raw === null) return null
    const parsed = parseFloat(raw)
    return Number.isNaN(parsed) ? null : parsed
  }
  if (type === 'object') {
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }
  return raw
}

export function readCookie(args: { cookie: string } & NumberCookieArgs): number | null
export function readCookie<T = unknown>(args: { cookie: string } & ObjectCookieArgs): T | null
export function readCookie(args: { cookie: string } & StringCookieArgs): string | null
export function readCookie<T>({
  cookie,
  key,
  type = 'string',
}: { cookie: string } & ReadCookieArgs): string | number | T | null {
  return parseCookieValue<T>(cookie, key, type)
}

export function readDocumentCookie(args: NumberCookieArgs): number | null
export function readDocumentCookie<T = unknown>(args: ObjectCookieArgs): T | null
export function readDocumentCookie(args: StringCookieArgs): string | null
export function readDocumentCookie<T>({
  key,
  type = 'string',
}: ReadCookieArgs): string | number | T | null {
  if (!getIsBrowser()) return null
  return parseCookieValue<T>(document.cookie, key, type)
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

export function writeDocumentCookieJSON(
  key: string,
  value: unknown,
  maxAge = COOKIE_MAX_AGE_1_YEAR
) {
  // readCookieString decodes, so encode the JSON (it contains ", {, , which are unsafe raw).
  writeDocumentCookie(key, encodeURIComponent(JSON.stringify(value)), maxAge)
}

export function removeDocumentCookie(key: string) {
  if (!getIsBrowser()) return
  document.cookie = `${key}=;path=/;max-age=0;samesite=lax`
}

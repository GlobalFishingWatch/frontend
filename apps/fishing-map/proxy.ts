/**
 * Basic auth proxy logic for TanStack Start.
 * Handles request interception for / and /monitoring paths.
 * Supports both root (/ and /map) and /monitoring paths for basepath deployments.
 */

const basicAuthEnabled =
  (process.env['BASIC_AUTH'] || 'none').toLocaleLowerCase() === 'restricted'
const basicAuthUser = process.env['BASIC_AUTH_USER']
const basicAuthPass = process.env['BASIC_AUTH_PASS']
const basePath =
  (process.env['NEXT_PUBLIC_URL'] || process.env['VITE_PUBLIC_URL'] || '/map').replace(/\/$/, '') ||
  '/map'

const AUTH_REQUIRED_RESPONSE = new Response('Auth Required.', {
  status: 401,
  headers: { 'WWW-authenticate': 'Basic realm="Secure Area"' },
})

function isRootPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return normalized === '/' || normalized === basePath
}

function isMonitoringPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return normalized === '/monitoring' || normalized === `${basePath}/monitoring`
}

export type ProxyResult =
  | { type: 'response'; response: Response }
  | { type: 'request'; request: Request }
  | { type: 'next' }

export function proxy(request: Request): ProxyResult {
  const url = new URL(request.url)
  const pathname = url.pathname
  const basicAuth = request.headers.get('authorization')

  // Remove authorization header for /monitoring endpoint (bypass basic auth)
  if (isMonitoringPath(pathname)) {
    if (basicAuth) {
      const headers = new Headers(request.headers)
      headers.delete('authorization')
      const modifiedRequest = new Request(request, { headers })
      return { type: 'request', request: modifiedRequest }
    }
    return { type: 'next' }
  }

  // Handle basic auth for root path
  if (isRootPath(pathname) && basicAuthEnabled) {
    if (basicAuth) {
      try {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue ?? '').split(':')
        if (user === basicAuthUser && pwd === basicAuthPass) {
          return { type: 'next' }
        }
      } catch {
        // Invalid auth format
      }
    }
    return { type: 'response', response: AUTH_REQUIRED_RESPONSE }
  }

  return { type: 'next' }
}

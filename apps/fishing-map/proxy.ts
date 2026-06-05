/**
 * Basic auth proxy logic for TanStack Start.
 * Handles request interception for / and /monitoring paths.
 * Supports both root (/ and /map) and /monitoring paths for basepath deployments.
 */

const basicAuthEnabled = (process.env['BASIC_AUTH'] || 'none').toLocaleLowerCase() === 'restricted'
const basicAuthUser = process.env['BASIC_AUTH_USER']
const basicAuthPass = process.env['BASIC_AUTH_PASS']
const basePath = (process.env['VITE_PUBLIC_URL'] || '/map').replace(/\/$/, '') || '/map'

function createAuthRequiredResponse() {
  return new Response('Auth Required.', {
    status: 401,
    headers: { 'WWW-authenticate': 'Basic realm="Secure Area"' },
  })
}

function isMonitoringPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return normalized === '/monitoring' || normalized === `${basePath}/monitoring`
}

// API endpoints are not gated by basic auth — basic auth only protects the app (page)
// routes. The API routes have their own same-origin guard for the write endpoints.
function isApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/') || pathname.startsWith(`${basePath}/api/`)
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

  // API routes bypass basic auth — only the app (page) routes are gated.
  if (isApiPath(pathname)) {
    return { type: 'next' }
  }

  // When restricted, every app (page) route requires valid basic auth.
  // (Previously only the root path was gated, so deep links bypassed it.)
  if (basicAuthEnabled) {
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
    return { type: 'response', response: createAuthRequiredResponse() }
  }

  return { type: 'next' }
}

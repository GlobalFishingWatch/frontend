import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const basicAuthEnabled = (process.env['BASIC_AUTH'] || 'none').toLocaleLowerCase() === 'restricted'
const basicAuthUser = process.env['BASIC_AUTH_USER']
const basicAuthPass = process.env['BASIC_AUTH_PASS']

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const basicAuth = request.headers.get('authorization')

  // Remove authorization header for /monitoring endpoint (bypass basic auth)
  if (url.pathname === '/monitoring') {
    const headers = new Headers(request.headers)
    headers.delete('authorization')

    return NextResponse.next({
      request: {
        headers: headers,
      },
    })
  }

  // Handle basic auth for root path
  if (url.pathname === '/' && basicAuthEnabled) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (user === basicAuthUser && pwd === basicAuthPass) {
        return NextResponse.next()
      }
    }
    url.pathname = '/api/auth'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    {
      source: '/monitoring',
      has: [{ type: 'header', key: 'authorization' }],
    },
  ],
}

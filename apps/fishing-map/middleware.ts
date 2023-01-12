// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

const basicAuthEnabled = (process.env['BASIC_AUTH'] || 'none').toLocaleLowerCase() === 'restricted'
const basicAuthUser = process.env['BASIC_AUTH_USER']
const basicAuthPass = process.env['BASIC_AUTH_PASS']

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API auth routes)
     * - favicon.ico (favicon file)
     * - icons/manifest.webmanifest (web manifest file)
     */
    '/((?!api|favicon.ico|icons/manifest.webmanifest).*)',
  ],
}

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const url = req.nextUrl
  if (!basicAuthEnabled) return NextResponse.next()
  if (authHeader) {
    const [authMethod, authValue] = authHeader.split(' ')
    if (authMethod === 'Basic') {
      const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':')

      if (user === basicAuthUser && pwd === basicAuthPass) {
        return NextResponse.next()
      }
    }
  }
  url.pathname = '/api/basic-auth'
  return NextResponse.rewrite(url)
}

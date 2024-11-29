// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

const basicAuthEnabled = (process.env['BASIC_AUTH'] || 'none').toLocaleLowerCase() === 'restricted'
const basicAuthUser = process.env['BASIC_AUTH_USER']
const basicAuthPass = process.env['BASIC_AUTH_PASS']

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl
  if (!basicAuthEnabled) return NextResponse.next()
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

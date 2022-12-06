// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

const basicAuthEnabled = (process.env['BASIC_AUTH'] || 'none').toLocaleLowerCase() === 'restricted'
const basicAuthUser = process.env['BASIC_AUTH_USER']
const basicAuthPass = process.env['BASIC_AUTH_PASS']

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const [authMethod, authValue] = (req.headers.get('authorization') ?? '').split(' ')
  const url = req.nextUrl
  if (!basicAuthEnabled) return NextResponse.next()
  if (authMethod === 'Basic') {
    const [user, pwd] = atob(authValue).split(':')

    if (user === basicAuthUser && pwd === basicAuthPass) {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/auth'
  return NextResponse.rewrite(url)
}

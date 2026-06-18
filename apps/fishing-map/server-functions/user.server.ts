import { createServerFn } from '@tanstack/react-start'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { readRequestCookieString } from 'utils/cookies'

async function fetchUserFromRequest(request: Request): Promise<UserData | null> {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null

  const token = readRequestCookieString(cookieHeader, USER_TOKEN_COOKIE_KEY)
  if (!token) return null

  try {
    const url = GFWAPI.generateUrl(`/auth/me`, { absolute: true })
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return null
    return (await response.json()) as UserData
  } catch (e) {
    // A bad/expired cookie token must not break SSR — fall back to the client,
    // which will re-resolve the user (and refresh the token) after hydration.
    console.warn('SSR user resolution failed', e)
    return null
  }
}

export const getUserState = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ user: UserData | null }> => {
    const { getRequest } = await import('@tanstack/react-start/server')
    const request = getRequest()
    return { user: await fetchUserFromRequest(request) }
  }
)

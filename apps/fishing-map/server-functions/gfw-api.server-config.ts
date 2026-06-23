import { AsyncLocalStorage } from 'node:async_hooks'

import { GFWAPI, readCookieString } from '@globalfishingwatch/api-client'

import { USER_REFRESH_TOKEN_COOKIE_KEY, USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'

type AuthTokenHolder = { token: string }
const authTokenALS = new AsyncLocalStorage<AuthTokenHolder>()

export function runRequestWithAuthToken<T>(request: Request, fn: () => T): T {
  const cookie = request.headers.get('cookie') ?? ''
  const token = readCookieString(cookie, USER_TOKEN_COOKIE_KEY) ?? ''
  return authTokenALS.run({ token }, fn)
}

/**
 * Analog of `client.tsx` GFWAPI.configuration for the server
 */
let configured = false

export function configureServerGFWAPI() {
  if (configured) return
  configured = true
  GFWAPI.configure({
    tokenStorage: {
      // No holder = called outside a request (boot / non-request code): no token available.
      get: () => authTokenALS.getStore()?.token ?? '',
      set: (value) => {
        const holder = authTokenALS.getStore()
        if (holder) holder.token = value
      },
    },
    refreshStrategy: async () => {
      // Dynamic imports: this module is loaded by start.ts at the start-instance init phase, where
      // loading the server runtime (or other server-only modules) at module-init breaks boot.
      const [{ getRequest, setCookie }, { refreshAuthTokens }] = await Promise.all([
        import('@tanstack/react-start/server'),
        import('server-functions/auth.functions'),
      ])
      const cookie = getRequest()?.headers.get('cookie') ?? ''
      const refreshToken = readCookieString(cookie, USER_REFRESH_TOKEN_COOKIE_KEY) ?? undefined

      const tokens = await refreshAuthTokens(refreshToken, setCookie)
      const holder = authTokenALS.getStore()
      if (holder) {
        holder.token = tokens.token
      }
      return tokens
    },
  })
}

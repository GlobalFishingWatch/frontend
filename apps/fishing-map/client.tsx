import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import * as Sentry from '@sentry/tanstackstart-react'
import { StartClient } from '@tanstack/react-start/client'

import { createCookieTokenStorage, GFWAPI } from '@globalfishingwatch/api-client'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { clearAuthCookiesServerFn, refreshTokenServerFn } from 'server-functions/auth.functions'

import 'utils/polyfills'

// One-time purge of pre-SSR auth artifacts. The app moved from localStorage tokens to
// cookies; these legacy keys are now inert but can confuse debugging and are the only place
// the api-client could still read a stale refresh token. Bump AUTH_RESET_VERSION on any
// future release that must force returning users onto a clean auth state.
// ponytail: version-gated so it runs once per release, not every boot. Only clears legacy
// localStorage — never the cookie session — so it cannot log a current user out.
const AUTH_RESET_VERSION = '2026-06-ssr-cookies'
try {
  if (localStorage.getItem('GFW_AUTH_RESET') !== AUTH_RESET_VERSION) {
    localStorage.removeItem('GFW_API_USER_TOKEN')
    localStorage.removeItem('GFW_API_USER_REFRESH_TOKEN')
    localStorage.setItem('GFW_AUTH_RESET', AUTH_RESET_VERSION)
  }
} catch {
  // localStorage unavailable (private mode / blocked) — nothing to clean up.
}

GFWAPI.configure({
  tokenStorage: createCookieTokenStorage(USER_TOKEN_COOKIE_KEY),
  refreshStrategy: () => refreshTokenServerFn(),
  sessionInvalidateStrategy: () => clearAuthCookiesServerFn(),
})

// A failed dynamic import usually means the deployed assets changed between deploys
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

Sentry.init({
  dsn: 'https://f093e15df0145c6c0b1b9afe8f15fdba@o4510353401577472.ingest.us.sentry.io/4510462762942464',
  enabled: import.meta.env.PROD,
  // RTK aborted errors doesn't need to be sent
  ignoreErrors: [/Aborted due to condition callback returning false/],
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  enableLogs: true,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  )
})

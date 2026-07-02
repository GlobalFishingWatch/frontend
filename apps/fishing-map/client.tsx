import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import * as Sentry from '@sentry/tanstackstart-react'
import { StartClient } from '@tanstack/react-start/client'

import { createCookieTokenStorage, GFWAPI } from '@globalfishingwatch/api-client'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { clearAuthCookiesServerFn, refreshTokenServerFn } from 'server-functions/auth.functions'

import 'utils/polyfills'

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

// The gateway silently expires refresh tokens ~with the access token (~30 min), so an
// idle SPA tab that only 401-refreshes at expiry can lose its session. When the access
// token enters its last 5.5 minutes, ping the refresh server fn — it lands in the
// server's proactive-rotation window and rotates once (store lease + navigator.locks
// dedupe across requests and tabs). Outside that window the ping never fires.
const KEEPALIVE_CHECK_MS = 60 * 1000
const KEEPALIVE_MARGIN_MS = 5.5 * 60 * 1000
const getTokenExpiry = (): number | null => {
  const token = document.cookie.match(new RegExp(`${USER_TOKEN_COOKIE_KEY}=([^;]+)`))?.[1]
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}
setInterval(() => {
  const expiry = getTokenExpiry()
  if (expiry && expiry - Date.now() < KEEPALIVE_MARGIN_MS && navigator.onLine) {
    navigator.locks
      .request('gfw-session-keepalive', () => refreshTokenServerFn())
      .catch(() => {
        // Dead session (401) already cleared cookies server-side; transient errors retry
        // on the next tick. Never surface keepalive noise to the user.
      })
  }
}, KEEPALIVE_CHECK_MS)

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

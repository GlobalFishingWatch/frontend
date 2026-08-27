import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import {
  getClient as getSentryClient,
  init as sentryInit,
  lazyLoadIntegration as lazyLoadSentryIntegration,
} from '@sentry/tanstackstart-react'
import { StartClient } from '@tanstack/react-start/client'

import { createCookieTokenStorage, GFWAPI } from '@globalfishingwatch/api-client'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { clearAuthCookiesServerFn, refreshTokenServerFn } from 'server-functions/auth.functions'
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from 'utils/dom'

import 'utils/polyfills'

const AUTH_RESET_VERSION = '2026-06-ssr-cookies'
try {
  if (getLocalStorageItem('GFW_AUTH_RESET') !== AUTH_RESET_VERSION) {
    removeLocalStorageItem('GFW_API_USER_TOKEN')
    removeLocalStorageItem('GFW_API_USER_REFRESH_TOKEN')
    setLocalStorageItem('GFW_AUTH_RESET', AUTH_RESET_VERSION)
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

sentryInit({
  dsn: 'https://f093e15df0145c6c0b1b9afe8f15fdba@o4510353401577472.ingest.us.sentry.io/4510462762942464',
  enabled: import.meta.env.PROD,
  environment: import.meta.env.VITE_WORKSPACE_ENV || 'unknown',
  // RTK aborted errors doesn't need to be sent
  ignoreErrors: [
    /Aborted due to condition callback returning false/,
    /^Script error\.?$/,
    /^uncaught exception: undefined$/,
    /WeakRef is not defined/,
  ],
  dataCollection: { userInfo: true, httpBodies: [] },
  tracesSampleRate: 0.1,
  denyUrls: [/googletagmanager\.com/, /google-analytics\.com/],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
})

if (import.meta.env.PROD) {
  void lazyLoadSentryIntegration('replayIntegration')
    .then((replayIntegration) => {
      getSentryClient()?.addIntegration(
        replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        })
      )
    })
    .catch(() => {
      // Replay is best-effort telemetry; losing it must never surface to the user or to Sentry.
    })
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  )
})

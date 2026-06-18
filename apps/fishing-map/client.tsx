import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import * as Sentry from '@sentry/tanstackstart-react'
import { StartClient } from '@tanstack/react-start/client'

import { createCookieTokenStorage, GFWAPI } from '@globalfishingwatch/api-client'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { refreshTokenServerFn } from 'server-functions/auth.server'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'

// Opt the shared client into the SSR auth model: the access token lives in a
// JS-readable cookie (so the server can read it from the request) and token refresh
// runs through the server function that holds the httpOnly refresh cookie.
GFWAPI.configure({
  tokenStorage: createCookieTokenStorage(USER_TOKEN_COOKIE_KEY),
  refreshStrategy: () => refreshTokenServerFn(),
})

// A failed dynamic import usually means the deployed assets changed under us
// (stale HTML referencing old hashed chunks) — reload to pick up the new build.
// Do NOT call event.preventDefault(): Vite only rethrows the original error when
// defaultPrevented is false. Suppressing it makes the import promise resolve with
// undefined, causing "Cannot read properties of undefined (reading 'default')".
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

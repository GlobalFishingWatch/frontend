import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import * as Sentry from '@sentry/tanstackstart-react'
import { StartClient } from '@tanstack/react-start/client'

import { createCookieTokenStorage, GFWAPI } from '@globalfishingwatch/api-client'

import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import { clearAuthCookiesServerFn, refreshTokenServerFn } from 'server-functions/auth.functions'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'

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

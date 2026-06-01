import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import * as Sentry from '@sentry/tanstackstart-react'
import { StartClient } from '@tanstack/react-start/client'

Sentry.init({
  dsn: 'https://f093e15df0145c6c0b1b9afe8f15fdba@o4510353401577472.ingest.us.sentry.io/4510462762942464',
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/gateway\.api\..*\.globalfishingwatch\.org/],
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  )
})

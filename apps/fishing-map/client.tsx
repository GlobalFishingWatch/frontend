import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import * as Sentry from '@sentry/tanstackstart-react'
import { StartClient } from '@tanstack/react-start/client'

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'

Sentry.init({
  dsn: 'https://f093e15df0145c6c0b1b9afe8f15fdba@o4510353401577472.ingest.us.sentry.io/4510462762942464',
  enabled: import.meta.env.PROD,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  enableLogs: true,
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  )
})

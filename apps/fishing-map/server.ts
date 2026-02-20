import * as Sentry from '@sentry/tanstackstart-react'
import server, { createServerEntry } from '@tanstack/react-start/server-entry'

import { proxy } from './proxy'

// Initialize Sentry for server-side error monitoring and tracing
if (process.env.NODE_ENV === 'production' && !process.env.NITRO_PRERENDER) {
  Sentry.init({
    dsn: 'https://f093e15df0145c6c0b1b9afe8f15fdba@o4510353401577472.ingest.us.sentry.io/4510462762942464',
    tracesSampleRate: 1,
    enableLogs: true,
    sendDefaultPii: true,
  })
}

type ServerFetchOpts = Parameters<typeof server.fetch>[1]

const fetchHandler = Sentry.wrapFetchWithSentry({
  async fetch(request, opts?: unknown) {
    const result = proxy(request)

    if (result.type === 'response') {
      return result.response
    }

    const requestToUse = result.type === 'request' ? result.request : request
    return server.fetch(requestToUse, opts as ServerFetchOpts)
  },
})

export default createServerEntry(fetchHandler)

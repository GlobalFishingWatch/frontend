import { wrapFetchWithSentry } from '@sentry/tanstackstart-react'
import type { Register } from '@tanstack/react-router'
import type { RequestOptions } from '@tanstack/react-start/server'
import server, { createServerEntry } from '@tanstack/react-start/server-entry'

import { configureServerGFWAPI } from './server-functions/gfw-api.server-config'
import { proxy } from './proxy'

configureServerGFWAPI()

const fetchHandler = {
  fetch(request: Request, opts?: unknown) {
    const result = proxy(request)

    if (result.type === 'response') {
      return result.response
    }

    const requestToUse = result.type === 'request' ? result.request : request
    return server.fetch(requestToUse, opts as RequestOptions<Register> | undefined)
  },
}

const sentryEntry =
  process.env.NODE_ENV === 'production' ? wrapFetchWithSentry(fetchHandler) : fetchHandler

export default createServerEntry(sentryEntry as Parameters<typeof createServerEntry>[0])

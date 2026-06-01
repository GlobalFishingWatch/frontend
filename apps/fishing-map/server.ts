import { wrapFetchWithSentry } from '@sentry/tanstackstart-react'
import type { Register } from '@tanstack/react-router'
import type { RequestOptions } from '@tanstack/react-start/server'
import server, { createServerEntry } from '@tanstack/react-start/server-entry'

import { proxy } from './proxy'

const sentryEntry = wrapFetchWithSentry({
  fetch(request, opts) {
    const result = proxy(request)

    if (result.type === 'response') {
      return result.response
    }

    const requestToUse = result.type === 'request' ? result.request : request
    return server.fetch(requestToUse, opts as RequestOptions<Register> | undefined)
  },
})

export default createServerEntry(sentryEntry as Parameters<typeof createServerEntry>[0])

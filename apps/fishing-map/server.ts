import { wrapFetchWithSentry } from '@sentry/tanstackstart-react'
import type { Register } from '@tanstack/react-router'
import type { RequestOptions } from '@tanstack/react-start/server'
import server, { createServerEntry } from '@tanstack/react-start/server-entry'

import { configureServerGFWAPI } from './server-functions/gfw-api.server-config'
import { proxy } from './proxy'

configureServerGFWAPI()

// Dev-only: Vite's SSR module runner swaps this module graph on every lib rebuild
// ("program reload"), which can tear down request-scoped modules (e.g. i18n) mid-render
// if a request is in flight. Vite awaits 'vite:beforeFullReload' listeners before clearing
// modules, so delay that swap until in-flight requests drain — closes the race instead of
// just reducing its odds. See module-runner.js's full-reload handler.
let inFlightRequests = 0

if (import.meta.hot) {
  const DRAIN_POLL_MS = 10
  const DRAIN_MAX_WAIT_MS = 3000

  import.meta.hot.on('vite:beforeFullReload', () => {
    const start = Date.now()
    return new Promise<void>((resolve) => {
      const check = () => {
        if (inFlightRequests === 0 || Date.now() - start > DRAIN_MAX_WAIT_MS) {
          resolve()
          return
        }
        setTimeout(check, DRAIN_POLL_MS)
      }
      check()
    })
  })
}

const fetchHandler = {
  async fetch(request: Request, opts?: unknown) {
    inFlightRequests++
    try {
      const result = proxy(request)

      if (result.type === 'response') {
        return result.response
      }

      const requestToUse = result.type === 'request' ? result.request : request
      return await server.fetch(requestToUse, opts as RequestOptions<Register> | undefined)
    } finally {
      inFlightRequests--
    }
  },
}

const sentryEntry =
  process.env.NODE_ENV === 'production' ? wrapFetchWithSentry(fetchHandler) : fetchHandler

export default createServerEntry(sentryEntry as Parameters<typeof createServerEntry>[0])

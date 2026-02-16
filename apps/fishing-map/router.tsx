import * as Sentry from '@sentry/tanstackstart-react'
import { createRouter, Navigate } from '@tanstack/react-router'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

// import { Spinner } from '@globalfishingwatch/ui-components'
import { PATH_BASENAME } from 'data/config'
import { setRouterRef } from 'router/router-ref'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

import { routeTree } from './routeTree.gen'

const parseAppWorkspace = (searchStr: string): QueryParams => {
  return parseWorkspace(searchStr, {
    reportAreaBounds: (reportAreaBounds: string[]) =>
      reportAreaBounds?.map((bound: string) => parseFloat(bound)),
  }) as QueryParams
}

let router: ReturnType<typeof createRouter>

export function getRouter() {
  if (typeof window !== 'undefined' && router) {
    return router
  }
  router = createRouter({
    routeTree,
    basepath: PATH_BASENAME,
    defaultPreload: false,
    scrollRestoration: true,
    defaultNotFoundComponent: () => <Navigate to={ROUTE_PATHS.HOME} />,
    stringifySearch: (search: QueryParams) => {
      const str = stringifyWorkspace(search)
      return str ? `?${str}` : ''
    },
    parseSearch: parseAppWorkspace,
  })

  if (!router.isServer) {
    Sentry.init({
      dsn: 'https://f093e15df0145c6c0b1b9afe8f15fdba@o4510353401577472.ingest.us.sentry.io/4510462762942464',
      enabled: import.meta.env.PROD,
      sendDefaultPii: true,
      integrations: [
        Sentry.tanstackRouterBrowserTracingIntegration(router),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      enableLogs: true,
      tracesSampleRate: 1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }

  return router
}

import * as Sentry from '@sentry/tanstackstart-react'
import { createRouter, Navigate } from '@tanstack/react-router'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

// import { Spinner } from '@globalfishingwatch/ui-components'
import { PATH_BASENAME } from 'data/config'
import { RouterErrorBoundary } from 'features/app/ErrorBoundaryRouter'
import { reportRouteError } from 'features/app/sentry'
import type { QueryParams } from 'types'

import { setRouterRef } from './router/router-ref'
import { routeTree } from './routeTree.gen'

const parseAppWorkspace = (searchStr: string): QueryParams => {
  return parseWorkspace(searchStr) as QueryParams
}

const normalizeSearchString = (searchStr: string): string => {
  // This is needed to match how TanStack Router normalizes the search string for SSR requests.
  // https://github.com/TanStack/router/blob/b0024d6310f123736ea18a7f8692b45265cdee74/packages/router-core/src/ssr/ssr-server.ts#L570C1-L570C58
  const params = new URLSearchParams(searchStr)
  params.sort()
  return params.toString()
}

const stringifyAppWorkspace = (search: QueryParams): string => {
  const str = normalizeSearchString(stringifyWorkspace(search))
  return str ? `?${str}` : ''
}

/**
 * Shared router configuration between production and integration tests.
 */
export function getCreateRouterOptions() {
  return {
    routeTree,
    basepath: PATH_BASENAME,
    defaultPreload: 'intent' as const,
    trailingSlash: 'never' as const,
    scrollRestoration: true,
    defaultPendingComponent: () => null,
    defaultErrorComponent: ({ error }: any) => <RouterErrorBoundary error={error} />,
    defaultOnCatch: (error: Error) => {
      reportRouteError(error, 'router-render')
    },
    defaultNotFoundComponent: () => <Navigate to="/" />,
    stringifySearch: stringifyAppWorkspace,
    parseSearch: parseAppWorkspace,
  }
}

export function createAppRouter() {
  const router = createRouter(getCreateRouterOptions())

  return router
}

export type AppRouter = ReturnType<typeof createAppRouter>

let router: AppRouter
export function getRouter() {
  if (!import.meta.env.SSR && router) {
    return router
  }
  router = createAppRouter()
  setRouterRef(router)

  if (!router.isServer && import.meta.env.PROD) {
    Sentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router))
  }

  return router
}

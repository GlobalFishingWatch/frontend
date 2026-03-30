import { createRouter, Navigate } from '@tanstack/react-router'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

// import { Spinner } from '@globalfishingwatch/ui-components'
import { PATH_BASENAME } from 'data/config'
import ErrorBoundaryUI from 'features/app/ErrorBoundaryUI'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

import { routeTree } from './routeTree.gen'

const parseAppWorkspace = (searchStr: string): QueryParams =>
  parseWorkspace(searchStr) as QueryParams

function createAppRouter() {
  const router = createRouter({
    routeTree,
    basepath: PATH_BASENAME,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPendingComponent: () => null,
    defaultErrorComponent: ({ error }) => <ErrorBoundaryUI error={error} />,
    defaultNotFoundComponent: () => <Navigate to={ROUTE_PATHS.HOME} />,
    stringifySearch: (search: QueryParams) => {
      const str = stringifyWorkspace(search)
      return str ? `?${str}` : ''
    },
    parseSearch: parseAppWorkspace,
  })

  return router
}

export type AppRouter = ReturnType<typeof createAppRouter>

let router: AppRouter
export function getRouter() {
  if (!import.meta.env.SSR && router) {
    return router
  }
  router = createAppRouter()
  return router
}

export function getRouterRef() {
  return router
}

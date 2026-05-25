import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { createRouter, Navigate } from '@tanstack/react-router'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

// import { Spinner } from '@globalfishingwatch/ui-components'
import { PATH_BASENAME } from 'data/config'
import ErrorBoundaryUI from 'features/app/ErrorBoundaryUI'
import { makeStore } from 'store'
import type { QueryParams } from 'types'

import { setRouterRef } from './router/router-ref'
import { routeTree } from './routeTree.gen'

function RouterErrorBoundary({ error }: { error: Error }) {
  const store = useMemo(() => makeStore(), [])
  return (
    <Provider store={store}>
      <ErrorBoundaryUI error={error} />
    </Provider>
  )
}

const parseAppWorkspace = (searchStr: string): QueryParams => {
  return parseWorkspace(searchStr) as QueryParams
}

const normalizeSearchString = (searchStr: string): string => {
  // This is needed to match how TanStack Router normalizes the search string for SSR requests.
  // https://github.com/TanStack/router/blob/b0024d6310f123736ea18a7f8692b45265cdee74/packages/router-core/src/ssr/ssr-server.ts#L570C1-L570C58
  return new URLSearchParams(searchStr).toString()
}

const stringifyAppWorkspace = (search: QueryParams): string => {
  const str = normalizeSearchString(stringifyWorkspace(search))
  return str ? `?${str}` : ''
}

function createAppRouter() {
  const router = createRouter({
    routeTree,
    basepath: PATH_BASENAME,
    defaultPreload: 'intent',
    trailingSlash: 'never',
    scrollRestoration: true,
    defaultPendingComponent: () => null,
    defaultErrorComponent: ({ error }: any) => <RouterErrorBoundary error={error} />,
    defaultNotFoundComponent: () => <Navigate to="/" />,
    stringifySearch: stringifyAppWorkspace,
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
  setRouterRef(router)
  return router
}

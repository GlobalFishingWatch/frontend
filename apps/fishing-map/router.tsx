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

  setRouterRef(router)

  return router
}

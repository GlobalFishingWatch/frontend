import { createRouter, Navigate } from '@tanstack/react-router'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME } from 'data/config'
import { setRouterRef } from 'router/router-ref'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

import { routeTree } from './routeTree.gen'

const parseAppWorkspace = (searchStr: string): Record<string, any> => {
  return parseWorkspace(searchStr, {
    reportAreaBounds: (reportAreaBounds: string[]) =>
      reportAreaBounds?.map((bound: string) => parseFloat(bound)),
  })
}

export function getRouter() {
  const router = createRouter({
    routeTree,
    basepath: PATH_BASENAME,
    defaultPreload: false,
    scrollRestoration: true,
    defaultNotFoundComponent: () => Navigate({ to: ROUTE_PATHS.HOME }),
    stringifySearch: (search: Record<string, unknown>) => {
      const str = stringifyWorkspace(search as QueryParams)
      return str ? `?${str}` : ''
    },
    parseSearch: (searchStr: string) => parseAppWorkspace(searchStr),
  })

  setRouterRef(router)

  return router
}

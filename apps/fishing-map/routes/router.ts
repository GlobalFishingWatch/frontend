import {
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME } from 'data/config'
import App from 'features/app/App'
import { t } from 'features/i18n/i18n'
import type { WorkspaceCategoryDescriptionKey } from 'routes/router.meta'
import { getRouteHead, getSearchHead, getWorkspaceHead } from 'routes/router.meta'
import type { QueryParams } from 'types'

import { ROUTE_PATHS } from './routes.utils'

// Re-export utilities from routes.utils
export { mapRouteIdToType, ROUTE_PATHS } from './routes.utils'

const parseAppWorkspace = (searchStr: string): Record<string, any> => {
  return parseWorkspace(searchStr, {
    reportAreaBounds: (reportAreaBounds: string[]) =>
      reportAreaBounds?.map((bound: string) => parseFloat(bound)),
  })
}

// Root route - renders the App component which handles all UI based on Redux state
const rootRoute = createRootRoute({
  component: App,
})

// Static routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.HOME,
  head: () => getRouteHead(),
})

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.USER,
  head: () => getRouteHead({ category: t((tr) => tr.user.profile) }),
})

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.SEARCH,
  head: getSearchHead,
})

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.REPORT,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const vesselRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.VESSEL,
  head: () => getRouteHead({ category: t((tr) => tr.vessel.title) }),
})

// Workspace routes — more specific paths must come first
const workspaceVesselRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACE_VESSEL,
  head: () => getRouteHead({ category: t((tr) => tr.vessel.title) }),
})

const workspaceSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACE_SEARCH,
  head: getSearchHead,
})

// WORKSPACE_REPORT with all params
const workspaceReportFullRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACE_REPORT_FULL,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

// WORKSPACE_REPORT with only datasetId
const workspaceReportPartialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACE_REPORT_DATASET,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

// WORKSPACE_REPORT base (no datasetId or areaId)
const workspaceReportBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACE_REPORT,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const vesselGroupReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.VESSEL_GROUP_REPORT,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const portReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.PORT_REPORT,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACE,
  head: ({ params }) => getRouteHead({ category: lowerCase(params.category || '') }),
})

const workspacesListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACES_LIST,
  head: ({ params }) =>
    getWorkspaceHead(lowerCase(params.category || '') as WorkspaceCategoryDescriptionKey),
})

// Catch-all for not found — redirect to HOME
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  beforeLoad: () => {
    throw redirect({ to: ROUTE_PATHS.HOME })
  },
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  userRoute,
  searchRoute,
  reportRoute,
  vesselRoute,
  workspaceVesselRoute,
  workspaceSearchRoute,
  workspaceReportFullRoute,
  workspaceReportPartialRoute,
  workspaceReportBaseRoute,
  vesselGroupReportRoute,
  portReportRoute,
  workspaceRoute,
  workspacesListRoute,
  notFoundRoute,
])

// Create history only on client side
const history = typeof window !== 'undefined' ? createBrowserHistory() : undefined

export const router = createRouter({
  routeTree,
  history,
  basepath: PATH_BASENAME,
  defaultPreload: false,
  stringifySearch: (search) => {
    const str = stringifyWorkspace(search as QueryParams)
    return str ? `?${str}` : ''
  },
  parseSearch: (searchStr) => parseAppWorkspace(searchStr),
})

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export type AppRouter = typeof router

import { lazy } from 'react'
import {
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
} from '@tanstack/react-router'
import { lowerCase } from 'es-toolkit'

import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME } from 'data/config'
import App from 'features/app/App'
import { t } from 'features/i18n/i18n'
import type { WorkspaceCategoryDescriptionKey } from 'routes/router.meta'
import { getRouteHead, getSearchHead, getWorkspaceHead } from 'routes/router.meta'
import type { QueryParams } from 'types'

import {
  validateReportSearchParams,
  validateRootSearchParams,
  validateSearchQueryParams,
  validateVesselSearchParams,
} from './routes.search'
import { ROUTE_PATHS } from './routes.utils'

// Re-export utilities from routes.utils
export { mapRouteIdToType, ROUTE_PATHS } from './routes.utils'

const parseAppWorkspace = (searchStr: string): Record<string, any> => {
  return parseWorkspace(searchStr, {
    reportAreaBounds: (reportAreaBounds: string[]) =>
      reportAreaBounds?.map((bound: string) => parseFloat(bound)),
  })
}

// ── Lazy-loaded route components ────────────────────────────────────────────
const Workspace = lazy(() => import('features/workspace/Workspace'))
const User = lazy(() => import('features/user/User'))
const Search = lazy(() => import('features/search/Search'))
const VesselProfile = lazy(() => import('features/vessel/Vessel'))
const AreaReport = lazy(() => import('features/reports/report-area/AreaReport'))
const PortsReport = lazy(() => import('features/reports/report-port/PortsReport'))
const VesselGroupReport = lazy(
  () => import('features/reports/report-vessel-group/VesselGroupReport')
)
const WorkspacesList = lazy(() => import('features/workspaces-list/WorkspacesList'))
const WorkspaceLayout = lazy(() => import('features/workspace/WorkspaceLayout'))

// ── Root route ──────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: App,
  validateSearch: validateRootSearchParams,
})

// ── Static routes ───────────────────────────────────────────────────────────
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.HOME,
  component: Workspace,
  head: () => getRouteHead(),
})

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.USER,
  component: User,
  head: () => getRouteHead({ category: t((tr) => tr.user.profile) }),
})

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.SEARCH,
  component: Search,
  validateSearch: validateSearchQueryParams,
  head: getSearchHead,
})

const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.REPORT,
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const vesselRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.VESSEL,
  component: VesselProfile,
  validateSearch: validateVesselSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.vessel.title) }),
})

const workspacesListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACES_LIST,
  component: WorkspacesList,
  head: ({ params }) =>
    getWorkspaceHead(lowerCase(params.category || '') as WorkspaceCategoryDescriptionKey),
})

// ── Workspace layout route (parent for all /$category/$workspaceId/* routes) ─
const workspaceLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_PATHS.WORKSPACE,
  component: WorkspaceLayout,
})

// ── Workspace child routes (relative paths under workspaceLayoutRoute) ──────
const workspaceIndexRoute = createRoute({
  getParentRoute: () => workspaceLayoutRoute,
  path: '/',
  component: Workspace,
  head: ({ params }) => getRouteHead({ category: lowerCase(params.category || '') }),
})

const workspaceVesselRoute = createRoute({
  getParentRoute: () => workspaceLayoutRoute,
  path: '/vessel/$vesselId',
  component: VesselProfile,
  validateSearch: validateVesselSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.vessel.title) }),
})

const workspaceSearchRoute = createRoute({
  getParentRoute: () => workspaceLayoutRoute,
  path: '/vessel-search',
  component: Search,
  validateSearch: validateSearchQueryParams,
  head: getSearchHead,
})

const workspaceReportFullRoute = createRoute({
  getParentRoute: () => workspaceLayoutRoute,
  path: '/report/$datasetId/$areaId',
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const workspaceReportPartialRoute = createRoute({
  getParentRoute: () => workspaceLayoutRoute,
  path: '/report/$datasetId',
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const workspaceReportBaseRoute = createRoute({
  getParentRoute: () => workspaceLayoutRoute,
  path: '/report',
  component: AreaReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const vesselGroupReportRoute = createRoute({
  getParentRoute: () => workspaceLayoutRoute,
  path: '/vessel-group-report/$vesselGroupId',
  component: VesselGroupReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

const portReportRoute = createRoute({
  getParentRoute: () => workspaceLayoutRoute,
  path: '/ports-report/$portId',
  component: PortsReport,
  validateSearch: validateReportSearchParams,
  head: () => getRouteHead({ category: t((tr) => tr.analysis.title) }),
})

// ── Route tree ──────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  homeRoute,
  userRoute,
  searchRoute,
  reportRoute,
  vesselRoute,
  workspacesListRoute,
  workspaceLayoutRoute.addChildren([
    workspaceIndexRoute,
    workspaceVesselRoute,
    workspaceSearchRoute,
    workspaceReportFullRoute,
    workspaceReportPartialRoute,
    workspaceReportBaseRoute,
    vesselGroupReportRoute,
    portReportRoute,
  ]),
])

// Create history only on client side
const history = typeof window !== 'undefined' ? createBrowserHistory() : undefined

export const router = createRouter({
  routeTree,
  history,
  basepath: PATH_BASENAME,
  defaultPreload: false,
  defaultNotFoundComponent: () => Navigate({ to: ROUTE_PATHS.HOME }),
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

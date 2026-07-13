import {
  DEFAULT_PATH_BASENAME,
  DEFAULT_WORKSPACE_CATEGORY,
  DEFAULT_WORKSPACE_ID,
  ROUTE_PATHS,
} from '@fishing-map/config'

export { DEFAULT_PATH_BASENAME as DEFAULT_BASENAME }

export type MapRouteType =
  | 'workspace'
  | 'workspaces-list'
  | 'report'
  | 'vessel'
  | 'vessel-search'
  | 'vessel-group-report'
  | 'ports-report'
  | 'user'

export type MapRouteParams = {
  category?: string
  workspaceId?: string
  datasetId?: string
  areaId?: string
  reportId?: string
  vesselId?: string
  vesselGroupId?: string
  portId?: string
}

export type MapRoute = { type: MapRouteType } & MapRouteParams

export type RouteNavigation = {
  to: string
  params: Record<string, string>
}

const required = (route: MapRoute, param: keyof MapRouteParams): string => {
  const value = route[param]
  if (!value) {
    throw new Error(`route.${param} is required for route type "${route.type}"`)
  }
  return value
}

/**
 * Returns the TanStack Router `to` pattern and `params` for a route,
 * matching the file routes in apps/fishing-map/routes/_app
 */
export const getRouteNavigation = (route: MapRoute): RouteNavigation => {
  const category = route.category || DEFAULT_WORKSPACE_CATEGORY
  const workspaceId = route.workspaceId || DEFAULT_WORKSPACE_ID
  const workspaceParams = { category, workspaceId }
  switch (route.type) {
    case 'workspace':
      if (!route.category && !route.workspaceId) {
        return { to: ROUTE_PATHS.HOME, params: {} }
      }
      return { to: ROUTE_PATHS.WORKSPACE, params: workspaceParams }
    case 'workspaces-list':
      return { to: ROUTE_PATHS.WORKSPACES_LIST, params: { category } }
    case 'report':
      if (route.reportId) {
        return { to: ROUTE_PATHS.REPORT, params: { reportId: route.reportId } }
      }
      if (!route.datasetId && !route.areaId) {
        return {
          to: ROUTE_PATHS.WORKSPACE_REPORT,
          params: { category: route.category || 'reports', workspaceId },
        }
      }
      return {
        to: ROUTE_PATHS.WORKSPACE_REPORT_FULL,
        params: {
          ...workspaceParams,
          datasetId: required(route, 'datasetId'),
          areaId: required(route, 'areaId'),
        },
      }
    case 'vessel':
      if (!route.category && !route.workspaceId) {
        return { to: ROUTE_PATHS.VESSEL, params: { vesselId: required(route, 'vesselId') } }
      }
      return {
        to: ROUTE_PATHS.WORKSPACE_VESSEL,
        params: { ...workspaceParams, vesselId: required(route, 'vesselId') },
      }
    case 'vessel-search':
      return { to: ROUTE_PATHS.WORKSPACE_SEARCH, params: workspaceParams }
    case 'vessel-group-report':
      return {
        to: ROUTE_PATHS.VESSEL_GROUP_REPORT,
        params: { ...workspaceParams, vesselGroupId: required(route, 'vesselGroupId') },
      }
    case 'ports-report':
      return {
        to: ROUTE_PATHS.PORT_REPORT,
        params: { ...workspaceParams, portId: required(route, 'portId') },
      }
    case 'user':
      return { to: ROUTE_PATHS.USER, params: {} }
    default:
      throw new Error(`Unknown route type "${(route as MapRoute).type}"`)
  }
}

export const buildRoutePath = (navigation: RouteNavigation): string => {
  const path = navigation.to
    .split('/')
    .map((segment) =>
      segment.startsWith('$')
        ? encodeURIComponent(navigation.params[segment.slice(1)] || '')
        : segment
    )
    .join('/')
  return path === '' ? '/' : path
}

/**
 * Matches a pathname (basename already stripped) against the app route patterns
 */
export const matchRoutePath = (pathname: string): MapRoute => {
  const segments = pathname.split('/').filter(Boolean).map(decodeURIComponent)
  if (segments.length === 0) {
    return { type: 'workspace' }
  }
  const [first, second, third, fourth, fifth] = segments
  if (segments.length === 1) {
    if (first === 'user') return { type: 'user' }
    if (first === 'vessel-search') return { type: 'vessel-search' }
    return { type: 'workspaces-list', category: first }
  }
  if (segments.length === 2) {
    if (first === 'report') return { type: 'report', reportId: second }
    if (first === 'vessel') return { type: 'vessel', vesselId: second }
    return { type: 'workspace', category: first, workspaceId: second }
  }
  const workspaceParams = { category: first, workspaceId: second }
  if (segments.length === 3) {
    if (third === 'vessel-search') return { type: 'vessel-search', ...workspaceParams }
    if (third === 'report') return { type: 'report', ...workspaceParams }
    return { type: 'workspace', ...workspaceParams }
  }
  if (segments.length === 4) {
    if (third === 'vessel') return { type: 'vessel', ...workspaceParams, vesselId: fourth }
    if (third === 'vessel-group-report') {
      return { type: 'vessel-group-report', ...workspaceParams, vesselGroupId: fourth }
    }
    if (third === 'ports-report') {
      return { type: 'ports-report', ...workspaceParams, portId: fourth }
    }
  }
  if (segments.length === 5 && third === 'report') {
    return { type: 'report', ...workspaceParams, datasetId: fourth, areaId: fifth }
  }
  return { type: 'workspace', ...workspaceParams }
}

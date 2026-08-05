import {
  DEFAULT_PATH_BASENAME,
  DEFAULT_WORKSPACE_CATEGORY,
  DEFAULT_WORKSPACE_ID,
  ROUTE_PATHS,
} from '@platform/config'

export const DEFAULT_BASENAME: string = DEFAULT_PATH_BASENAME

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
 * matching the file routes in apps/platform/routes/_platform
 */
export const getRouteNavigation = (route: MapRoute): RouteNavigation => {
  const category = route.category || DEFAULT_WORKSPACE_CATEGORY
  const workspaceId = route.workspaceId || DEFAULT_WORKSPACE_ID
  const workspaceParams = { category, workspaceId }
  switch (route.type) {
    case 'workspace':
      if (!route.category && !route.workspaceId) {
        return { to: ROUTE_PATHS.MAP, params: {} }
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
      if (!route.category && !route.workspaceId) {
        return { to: ROUTE_PATHS.SEARCH, params: {} }
      }
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

// Static-segment patterns listed before parametric ones of the same length,
// so e.g. /user wins over /$category. Types map each ROUTE_PATHS pattern.
const ROUTE_PATTERNS: [string, MapRouteType][] = [
  [ROUTE_PATHS.MAP, 'workspace'],
  [ROUTE_PATHS.USER, 'user'],
  [ROUTE_PATHS.SEARCH, 'vessel-search'],
  [ROUTE_PATHS.REPORT, 'report'],
  [ROUTE_PATHS.VESSEL, 'vessel'],
  [ROUTE_PATHS.WORKSPACES_LIST, 'workspaces-list'],
  [ROUTE_PATHS.WORKSPACE, 'workspace'],
  [ROUTE_PATHS.WORKSPACE_SEARCH, 'vessel-search'],
  [ROUTE_PATHS.WORKSPACE_VESSEL, 'vessel'],
  [ROUTE_PATHS.WORKSPACE_REPORT, 'report'],
  [ROUTE_PATHS.WORKSPACE_REPORT_FULL, 'report'],
  [ROUTE_PATHS.VESSEL_GROUP_REPORT, 'vessel-group-report'],
  [ROUTE_PATHS.PORT_REPORT, 'ports-report'],
]

// Pre-standalone paths the app still serves as 308 redirects (routes/_platform/_map/map/{user,
// vessel-search,report.$reportId,vessel.$vesselId}.tsx). Matched before ROUTE_PATTERNS, because
// '/map/user' would otherwise read as the '/map/$category' workspaces list.
const LEGACY_ROUTE_PATTERNS: [string, MapRouteType][] = [
  ['/map/user', 'user'],
  ['/map/vessel-search', 'vessel-search'],
  ['/map/report/$reportId', 'report'],
  ['/map/vessel/$vesselId', 'vessel'],
]

const matchPattern = (pattern: string, segments: string[]): MapRouteParams | undefined => {
  const patternSegments = pattern.split('/').filter(Boolean)
  if (patternSegments.length !== segments.length) return undefined
  const params: Record<string, string> = {}
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i]
    if (patternSegment.startsWith('$')) {
      params[patternSegment.slice(1)] = segments[i]
    } else if (patternSegment !== segments[i]) {
      return undefined
    }
  }
  return params
}

/**
 * Matches a pathname (basename already stripped) against the ROUTE_PATHS patterns
 */
export const matchRoutePath = (pathname: string): MapRoute => {
  const segments = pathname.split('/').filter(Boolean).map(decodeURIComponent)
  if (segments.length === 0) {
    // The platform root. It currently 404s straight to the default workspace map, so reporting a
    // workspace matches what the user actually lands on. Revisit when a landing page exists.
    return { type: 'workspace' }
  }
  for (const [pattern, type] of [...LEGACY_ROUTE_PATTERNS, ...ROUTE_PATTERNS]) {
    const params = matchPattern(pattern, segments)
    if (params) {
      return { type, ...params }
    }
  }
  // Unrecognised shape. Map URLs are '/map/<category>/<workspaceId>', so the workspace params are
  // offset by the '/map' segment; anything else has no workspace to report.
  if (segments[0] === 'map') {
    return { type: 'workspace', category: segments[1], workspaceId: segments[2] }
  }
  return { type: 'workspace' }
}

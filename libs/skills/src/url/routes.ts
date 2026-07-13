export const DEFAULT_BASENAME = '/map'
export const DEFAULT_WORKSPACE_CATEGORY = 'fishing-activity'
export const DEFAULT_WORKSPACE_ID = 'default-public'

export const WORKSPACE_CATEGORIES = ['fishing-activity', 'marine-manager', 'reports'] as const
export type WorkspaceCategory = (typeof WORKSPACE_CATEGORIES)[number]

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
        return { to: '/', params: {} }
      }
      return { to: '/$category/$workspaceId', params: workspaceParams }
    case 'workspaces-list':
      return { to: '/$category', params: { category } }
    case 'report':
      if (route.reportId) {
        return { to: '/report/$reportId', params: { reportId: route.reportId } }
      }
      return {
        to: '/$category/$workspaceId/report/$datasetId/$areaId',
        params: {
          ...workspaceParams,
          datasetId: required(route, 'datasetId'),
          areaId: required(route, 'areaId'),
        },
      }
    case 'vessel':
      if (!route.category && !route.workspaceId) {
        return { to: '/vessel/$vesselId', params: { vesselId: required(route, 'vesselId') } }
      }
      return {
        to: '/$category/$workspaceId/vessel/$vesselId',
        params: { ...workspaceParams, vesselId: required(route, 'vesselId') },
      }
    case 'vessel-search':
      return { to: '/$category/$workspaceId/vessel-search', params: workspaceParams }
    case 'vessel-group-report':
      return {
        to: '/$category/$workspaceId/vessel-group-report/$vesselGroupId',
        params: { ...workspaceParams, vesselGroupId: required(route, 'vesselGroupId') },
      }
    case 'ports-report':
      return {
        to: '/$category/$workspaceId/ports-report/$portId',
        params: { ...workspaceParams, portId: required(route, 'portId') },
      }
    case 'user':
      return { to: '/user', params: {} }
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

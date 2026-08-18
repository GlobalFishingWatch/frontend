export const DEFAULT_PATH_BASENAME = '/platform'

/**
 * Single source of truth for routing: URL patterns and the route-type names Redux stores in
 * `location.type`. Every path is 1:1 with a route type, so the type names are derived from the keys.
 *
 * `{-$param}` marks an optional path param: the report route serves `/report`,
 * `/report/$datasetId` and `/report/$datasetId/$areaId`.
 */
export const ROUTE_PATHS = {
  // Platform
  LANDING: '/' as const,
  // Standalone — no /map segment
  USER: '/user' as const,
  SEARCH: '/vessel-search' as const,
  REPORT: '/report/$reportId' as const,
  VESSEL: '/vessel/$vesselId' as const,
  // Map
  MAP: '/map' as const,
  WORKSPACES_LIST: '/map/$category' as const,
  WORKSPACE: '/map/$category/$workspaceId' as const,
  WORKSPACE_SEARCH: '/map/$category/$workspaceId/vessel-search' as const,
  WORKSPACE_VESSEL: '/map/$category/$workspaceId/vessel/$vesselId' as const,
  WORKSPACE_REPORT: '/map/$category/$workspaceId/report/{-$datasetId}/{-$areaId}' as const,
  VESSEL_GROUP_REPORT: '/map/$category/$workspaceId/vessel-group-report/$vesselGroupId' as const,
  PORT_REPORT: '/map/$category/$workspaceId/ports-report/$portId' as const,
} as const

export type RoutePathKey = keyof typeof ROUTE_PATHS
export type RoutePathValues = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS]

/** Route types are the path keys themselves, so they cannot drift from ROUTE_PATHS. */
export type ROUTE_TYPES = RoutePathKey

/** The route-type name constants, generated from the same keys. */
export const ROUTE_TYPES = Object.fromEntries(
  (Object.keys(ROUTE_PATHS) as RoutePathKey[]).map((key) => [key, key])
) as { [K in ROUTE_TYPES]: K }

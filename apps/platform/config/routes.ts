export const DEFAULT_PATH_BASENAME = '/platform'

/**
 * Single source of truth for routing: URL patterns, the route-type names Redux stores in
 * `location.type`, and the mapping between them.
 */
export const ROUTE_PATHS = {
  // Platform
  LANDING: '/' as const,
  // Standalone — no /map segment
  USER: '/user' as const,
  SEARCH: '/vessel-search' as const,
  REPORT: '/report/$reportId' as const,
  VESSEL: '/vessel/$vesselId' as const,
  HELP_HUB: '/help-and-resources' as const,
  // Map
  MAP: '/map' as const,
  WORKSPACES_LIST: '/map/$category' as const,
  WORKSPACE: '/map/$category/$workspaceId' as const,
  WORKSPACE_SEARCH: '/map/$category/$workspaceId/vessel-search' as const,
  WORKSPACE_VESSEL: '/map/$category/$workspaceId/vessel/$vesselId' as const,
  WORKSPACE_REPORT: '/map/$category/$workspaceId/report' as const,
  WORKSPACE_REPORT_DATASET: '/map/$category/$workspaceId/report/$datasetId' as const,
  WORKSPACE_REPORT_FULL: '/map/$category/$workspaceId/report/$datasetId/$areaId' as const,
  VESSEL_GROUP_REPORT: '/map/$category/$workspaceId/vessel-group-report/$vesselGroupId' as const,
  PORT_REPORT: '/map/$category/$workspaceId/ports-report/$portId' as const,
} as const

export type RoutePathKey = keyof typeof ROUTE_PATHS
export type RoutePathValues = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS]

/**
 * Path keys that are NOT their own route type — several URLs can share one `location.type`.
 *
 * Only the three workspace-report paths do this: `/report`, `/report/$datasetId` and
 * `/report/$datasetId/$areaId` are all WORKSPACE_REPORT. Everything else is 1:1, which is why the
 * route types below can be generated instead of hand-listed.
 *
 * Both sides are checked: keys must be real ROUTE_PATHS keys, values must be real route types.
 */
type PathAliasKey = 'WORKSPACE_REPORT_DATASET' | 'WORKSPACE_REPORT_FULL'

/** Route types = path keys, minus the aliases above. Derived, so it cannot drift from ROUTE_PATHS. */
export type ROUTE_TYPES = Exclude<RoutePathKey, PathAliasKey>

const PATH_ALIASES: Record<PathAliasKey, ROUTE_TYPES> = {
  WORKSPACE_REPORT_DATASET: 'WORKSPACE_REPORT',
  WORKSPACE_REPORT_FULL: 'WORKSPACE_REPORT',
}

/** Every path key → its route type. Generated, so a new path can never be missing a mapping. */
export const PATH_KEY_TO_ROUTE_TYPE = Object.fromEntries(
  (Object.keys(ROUTE_PATHS) as RoutePathKey[]).map((key) => [
    key,
    key in PATH_ALIASES ? PATH_ALIASES[key as PathAliasKey] : (key as ROUTE_TYPES),
  ])
) as Record<RoutePathKey, ROUTE_TYPES>

/** The route-type name constants, generated from the same keys. */
export const ROUTE_TYPES = Object.fromEntries(
  (Object.keys(ROUTE_PATHS) as RoutePathKey[])
    .filter((key): key is ROUTE_TYPES => !(key in PATH_ALIASES))
    .map((key) => [key, key])
) as { [K in ROUTE_TYPES]: K }

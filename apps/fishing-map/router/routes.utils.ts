import type { RoutePathValues } from '@fishing-map/config/routes'
import { ROUTE_PATHS } from '@fishing-map/config/routes'

import { PATH_BASENAME } from 'data/config'
import { getIsBrowser } from 'utils/dom'

import { getRouterRef } from './router-ref'
import type { ROUTE_TYPES } from './routes'
import {
  HOME,
  PORT_REPORT,
  REPORT,
  SEARCH,
  USER,
  VESSEL,
  VESSEL_GROUP_REPORT,
  WORKSPACE,
  WORKSPACE_REPORT,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACES_LIST,
} from './routes'

// ============================================================================
// TanStack Router Type-Safe Navigation
// ============================================================================

// Route path literals for type-safe navigation (single source of truth in @fishing-map/config)
export { ROUTE_PATHS } from '@fishing-map/config/routes'
export type { RoutePathValues } from '@fishing-map/config/routes'

/** TanStack Router does not have WORKSPACE_REPORT_DATASET - only report index and report/$datasetId/$areaId */
export type ValidRoutePathValues = Exclude<
  RoutePathValues,
  typeof ROUTE_PATHS.WORKSPACE_REPORT_DATASET
>

/**
 * TanStack Router only has report routes with areaId (/$datasetId/$areaId).
 * WORKSPACE_REPORT_DATASET (/$datasetId) is not a valid route.
 * This normalizes paths for Link/navigate: when we have datasetId but no areaId,
 * fall back to report index; when we have areaId, use the full path.
 */
export function toValidRoutePath(
  path: RoutePathValues,
  params?: { datasetId?: string; areaId?: string; [key: string]: string | undefined }
): ValidRoutePathValues {
  if (path === ROUTE_PATHS.WORKSPACE_REPORT_DATASET) {
    if (params?.areaId) {
      return ROUTE_PATHS.WORKSPACE_REPORT_FULL
    }
    return ROUTE_PATHS.WORKSPACE_REPORT
  }
  return path as ValidRoutePathValues
}

// ============================================================================
// Legacy Route Type Mapping (for backward compatibility)
// ============================================================================

// Map ROUTE_PATHS keys to ROUTE_TYPES constants
const PATH_KEY_TO_TYPE = {
  HOME,
  USER,
  SEARCH,
  REPORT,
  VESSEL,
  WORKSPACES_LIST,
  WORKSPACE,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACE_REPORT,
  WORKSPACE_REPORT_DATASET: WORKSPACE_REPORT,
  WORKSPACE_REPORT_FULL: WORKSPACE_REPORT,
  VESSEL_GROUP_REPORT,
  PORT_REPORT,
} as const

// Build ROUTE_ID_TO_TYPE by inverting ROUTE_PATHS
const ROUTE_ID_TO_TYPE: Record<string, ROUTE_TYPES> = Object.entries(ROUTE_PATHS).reduce(
  (acc, [key, path]) => {
    acc[path] = PATH_KEY_TO_TYPE[key as keyof typeof PATH_KEY_TO_TYPE]
    return acc
  },
  {} as Record<string, ROUTE_TYPES>
)

// The workspace index route (nested under workspaceLayoutRoute) generates
// a trailing-slash routeId: /$category/$workspaceId/
// Map it to the WORKSPACE type for backward compat with Redux location state.
ROUTE_ID_TO_TYPE['/$category/$workspaceId/'] = WORKSPACE

export function mapRouteIdToType(routeId: string): ROUTE_TYPES {
  // Strip /_app prefix from file-based route IDs and trailing slashes
  const normalized = routeId.replace(/^\/_app/, '').replace(/\/$/, '') || '/'
  return ROUTE_ID_TO_TYPE[normalized] || HOME
}

/**
 * Map TanStack Router's routeId (which is the path pattern) to our ROUTE_PATHS constant.
 * The routeId is already the path pattern, so this is mostly a pass-through with fallback.
 */
export function mapRouteIdToPath(routeId: string): string {
  // Find the matching ROUTE_PATHS value
  const matchingPath = Object.values(ROUTE_PATHS).find((path) => path === routeId)
  return matchingPath || ROUTE_PATHS.HOME
}

/**
 * Get the current full URL from the router state.
 * Use this instead of window.location.href to stay consistent with router state.
 */
export function getCurrentAppUrl(): string {
  if (!getIsBrowser()) {
    return ''
  }
  const router = getRouterRef()
  if (!router) {
    return ''
  }
  const href = router.state.location?.href ?? ''
  return href.startsWith(PATH_BASENAME)
    ? window.location.origin + href
    : window.location.origin + PATH_BASENAME + (href || '/')
}

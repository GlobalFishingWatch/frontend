import type { RoutePathKey, RoutePathValues } from '@platform/config/routes'
import { PATH_KEY_TO_ROUTE_TYPE, ROUTE_PATHS } from '@platform/config/routes'

import { IS_DEVELOPMENT_ENV, PATH_BASENAME } from 'data/map/config'
import { getIsBrowser } from 'utils/dom'

import { getRouterRef } from './router-ref'
import type { ROUTE_TYPES } from './routes'
import { MAP } from './routes'

// ============================================================================
// TanStack Router Type-Safe Navigation
// ============================================================================

// Route path literals for type-safe navigation (single source of truth in @platform/config)
export { ROUTE_PATHS } from '@platform/config/routes'
export type { RoutePathValues } from '@platform/config/routes'

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

// Keyed by route *path* pattern, built by inverting ROUTE_PATHS through the exhaustive
// PATH_KEY_TO_ROUTE_TYPE map in @platform/config/routes.
const ROUTE_PATH_TO_TYPE: Record<string, ROUTE_TYPES> = Object.entries(ROUTE_PATHS).reduce(
  (acc, [key, path]) => {
    acc[path] = PATH_KEY_TO_ROUTE_TYPE[key as RoutePathKey]
    return acc
  },
  {} as Record<string, ROUTE_TYPES>
)

/**
 * Strip the trailing slash that index routes carry (`/$category/$workspaceId/`) so the value matches
 * the ROUTE_PATHS literals, which never end in one.
 */
export function normalizeRoutePath(fullPath: string): string {
  return fullPath.replace(/\/$/, '') || '/'
}

/**
 * Map a route to its legacy ROUTE_TYPES constant for Redux `state.location.type`.
 *
 * Takes a match's `fullPath`, NOT its `routeId`: `fullPath` already excludes pathless layout
 * segments (`/_app`, `/_app/_shell`, …), so this keeps working when layouts are added, removed or
 * renamed. `routeId` would need a strip rule per layout, which is order-sensitive and easy to get
 * wrong silently.
 */
export function mapRoutePathToType(fullPath: string): ROUTE_TYPES {
  const normalized = normalizeRoutePath(fullPath)
  const routeType = ROUTE_PATH_TO_TYPE[normalized]
  if (!routeType && IS_DEVELOPMENT_ENV) {
    // Falling back to MAP silently would mask a broken mapping during the platform migration.
    console.warn(`[router] no ROUTE_TYPES mapping for route path "${normalized}", assuming MAP`)
  }
  return routeType || MAP
}

/**
 * Map TanStack Router's routeId (which is the path pattern) to our ROUTE_PATHS constant.
 * The routeId is already the path pattern, so this is mostly a pass-through with fallback.
 */
export function mapRouteIdToPath(routeId: string): string {
  // Find the matching ROUTE_PATHS value
  const matchingPath = Object.values(ROUTE_PATHS).find((path) => path === routeId)
  return matchingPath || ROUTE_PATHS.MAP
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

import { ROUTE_PATHS } from '@platform/config/routes'

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

// ============================================================================
// Legacy Route Type Mapping (for backward compatibility)
// ============================================================================

// Keyed by route *path* pattern. Paths and route types are 1:1, so this is just ROUTE_PATHS inverted.
const ROUTE_PATH_TO_TYPE: Record<string, ROUTE_TYPES> = Object.fromEntries(
  Object.entries(ROUTE_PATHS).map(([key, path]) => [path, key as ROUTE_TYPES])
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

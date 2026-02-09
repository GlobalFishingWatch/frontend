import type { RegisteredRouter } from '@tanstack/react-router'
import type { RouteByPath, RoutePaths } from '@tanstack/router-core'

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

/**
 * All valid route paths in the application.
 * This is derived from the registered router's route tree.
 */
export type AppRoutePaths = RoutePaths<RegisteredRouter['routeTree']>

// Route path literals for type-safe navigation
export const ROUTE_PATHS = {
  HOME: '/' as const,
  USER: '/user' as const,
  SEARCH: '/vessel-search' as const,
  REPORT: '/report/$reportId' as const,
  VESSEL: '/vessel/$vesselId' as const,
  WORKSPACES_LIST: '/$category' as const,
  WORKSPACE: '/$category/$workspaceId' as const,
  WORKSPACE_SEARCH: '/$category/$workspaceId/vessel-search' as const,
  WORKSPACE_VESSEL: '/$category/$workspaceId/vessel/$vesselId' as const,
  WORKSPACE_REPORT: '/$category/$workspaceId/report' as const,
  WORKSPACE_REPORT_DATASET: '/$category/$workspaceId/report/$datasetId' as const,
  WORKSPACE_REPORT_FULL: '/$category/$workspaceId/report/$datasetId/$areaId' as const,
  VESSEL_GROUP_REPORT: '/$category/$workspaceId/vessel-group-report/$vesselGroupId' as const,
  PORT_REPORT: '/$category/$workspaceId/ports-report/$portId' as const,
} as const

export type RoutePathValues = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS]

/**
 * Get the params type for a specific route path.
 * This uses TanStack Router's auto-generated types from the route tree.
 */
export type ParamsForRoute<TPath extends AppRoutePaths> = RouteByPath<
  RegisteredRouter['routeTree'],
  TPath
>['types']['allParams']

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

export function mapRouteIdToType(routeId: string): ROUTE_TYPES {
  return ROUTE_ID_TO_TYPE[routeId] || HOME
}

// Map from ROUTE_TYPES to route path patterns for navigation
export const ROUTE_TYPE_TO_PATH = {
  [HOME]: ROUTE_PATHS.HOME,
  [USER]: ROUTE_PATHS.USER,
  [SEARCH]: ROUTE_PATHS.SEARCH,
  [REPORT]: ROUTE_PATHS.REPORT,
  [VESSEL]: ROUTE_PATHS.VESSEL,
  [WORKSPACES_LIST]: ROUTE_PATHS.WORKSPACES_LIST,
  [WORKSPACE]: ROUTE_PATHS.WORKSPACE,
  [WORKSPACE_SEARCH]: ROUTE_PATHS.WORKSPACE_SEARCH,
  [WORKSPACE_VESSEL]: ROUTE_PATHS.WORKSPACE_VESSEL,
  [WORKSPACE_REPORT]: ROUTE_PATHS.WORKSPACE_REPORT_FULL,
  [VESSEL_GROUP_REPORT]: ROUTE_PATHS.VESSEL_GROUP_REPORT,
  [PORT_REPORT]: ROUTE_PATHS.PORT_REPORT,
} as const satisfies Record<ROUTE_TYPES, RoutePathValues>

// ============================================================================
// Path Building Utilities
// ============================================================================

function interpolatePath(pattern: string, params: Record<string, any>): string {
  return pattern.replace(/\$([a-zA-Z]+)/g, (_, key) => {
    return encodeURIComponent(params[key] || '')
  })
}

/**
 * Build a concrete path from a route type and payload by interpolating params.
 * For routes with optional params that are missing, use the appropriate shorter path variant.
 * @deprecated Prefer using ROUTE_PATHS constants directly with TanStack Router's Link component
 */
export function buildPathForRouteType(
  type: ROUTE_TYPES,
  payload: Record<string, any> = {}
): string {
  // Handle WORKSPACE_REPORT optional params
  if (type === WORKSPACE_REPORT) {
    if (!payload.datasetId && !payload.areaId) {
      return interpolatePath(ROUTE_PATHS.WORKSPACE_REPORT, payload)
    }
    if (!payload.areaId) {
      return interpolatePath(ROUTE_PATHS.WORKSPACE_REPORT_DATASET, payload)
    }
  }

  // Handle WORKSPACE vs WORKSPACES_LIST (workspaceId optional)
  if (type === WORKSPACE && !payload.workspaceId) {
    return interpolatePath(ROUTE_PATHS.WORKSPACES_LIST, payload)
  }

  const pathPattern = ROUTE_TYPE_TO_PATH[type]
  if (!pathPattern) {
    return ROUTE_PATHS.HOME
  }
  return interpolatePath(pathPattern, payload)
}

/**
 * Routes that don't require params (empty params object).
 */
type NoParamsRoutes = '/' | '/user' | '/vessel-search'

/**
 * Type-safe link props builder for use with TanStack Router's Link component.
 * Returns an object that can be spread directly into a Link component.
 *
 * Uses TanStack Router's auto-generated types for full type safety.
 *
 * @example
 * // Simple route without params
 * <Link {...linkTo(ROUTE_PATHS.HOME)} />
 *
 * // Route with params (TypeScript enforces correct params from router types)
 * <Link {...linkTo(ROUTE_PATHS.WORKSPACE, { category: 'fishing', workspaceId: '123' })} />
 *
 * // With search params
 * <Link {...linkTo(ROUTE_PATHS.WORKSPACE, { category: 'fishing', workspaceId: '123' })} search={{ zoom: 5 }} />
 */
export function linkTo<TPath extends NoParamsRoutes>(to: TPath): { to: TPath }
export function linkTo<TPath extends Exclude<AppRoutePaths, NoParamsRoutes>>(
  to: TPath,
  params: ParamsForRoute<TPath>
): { to: TPath; params: ParamsForRoute<TPath> }
export function linkTo<TPath extends AppRoutePaths>(
  to: TPath,
  params?: ParamsForRoute<TPath>
): { to: TPath; params?: ParamsForRoute<TPath> } {
  return params ? { to, params } : { to }
}

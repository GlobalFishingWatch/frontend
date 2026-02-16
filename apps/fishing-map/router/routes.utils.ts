import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'
import { DEFAULT_CALLBACK_URL_PARAM } from '@globalfishingwatch/react-hooks'

import { PATH_BASENAME } from 'data/config'
import type { QueryParams } from 'types'

import { getRouterRef } from '../router'

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
 * Transient auth params that should never persist in the URL.
 * They are read from `window.location.search` on mount (before any router navigation)
 * by `useReplaceLoginUrl`, so stripping them here is safe.
 */
const TRANSIENT_PARAMS = [ACCESS_TOKEN_STRING, DEFAULT_CALLBACK_URL_PARAM] as const
export function cleanAccessTokenQueryParams(query: Partial<QueryParams>): Partial<QueryParams> {
  for (const param of TRANSIENT_PARAMS) {
    delete query[param]
  }
  return query
}

/**
 * Get the current full URL from the router state.
 * Use this instead of window.location.href to stay consistent with router state.
 */
export function getCurrentAppUrl(): string {
  if (typeof window === 'undefined') {
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

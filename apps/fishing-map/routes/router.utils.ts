import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME } from 'data/config'
import type { QueryParams } from 'types'

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
import type { LinkToPayload } from './routes.types'

// Map route types to path patterns
const ROUTE_TYPE_TO_PATTERN: Record<ROUTE_TYPES, string> = {
  [HOME]: '/index',
  [USER]: '/user',
  [SEARCH]: '/vessel-search',
  [REPORT]: '/report/:reportId',
  [VESSEL]: '/vessel/:vesselId',
  [WORKSPACES_LIST]: '/:category',
  [WORKSPACE]: '/:category/:workspaceId?',
  [WORKSPACE_SEARCH]: '/:category/:workspaceId/vessel-search',
  [WORKSPACE_VESSEL]: '/:category/:workspaceId/vessel/:vesselId',
  [WORKSPACE_REPORT]: '/:category/:workspaceId/report/:datasetId?/:areaId?',
  [VESSEL_GROUP_REPORT]: '/:category/:workspaceId/vessel-group-report/:vesselGroupId',
  [PORT_REPORT]: '/:category/:workspaceId/ports-report/:portId',
}


/**
 * Convert LinkTo format to TanStack Router path
 */
export function linkToToPath(type: ROUTE_TYPES, payload: LinkToPayload): string {
  const pattern = ROUTE_TYPE_TO_PATTERN[type]
  if (!pattern) {
    console.warn(`Unknown route type: ${type}`)
    return '/index'
  }

  let path = pattern

  // Replace path parameters
  if (payload.reportId) path = path.replace(':reportId', payload.reportId)
  if (payload.vesselId) path = path.replace(':vesselId', payload.vesselId)
  if (payload.category) path = path.replace(':category', payload.category)
  if (payload.workspaceId) {
    path = path.replace(':workspaceId?', payload.workspaceId)
    path = path.replace(':workspaceId', payload.workspaceId)
  }
  if (payload.datasetId) {
    path = path.replace(':datasetId?', payload.datasetId)
    path = path.replace(':datasetId', payload.datasetId)
  }
  if (payload.areaId) {
    path = path.replace(':areaId?', payload.areaId)
    path = path.replace(':areaId', payload.areaId)
  }
  if (payload.vesselGroupId) path = path.replace(':vesselGroupId', payload.vesselGroupId)
  if (payload.portId) path = path.replace(':portId', payload.portId)

  // Remove optional parameters that weren't provided
  path = path.replace(/\/:[^/]*\?/g, '')

  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path
  }

  return path
}

/**
 * Determine route type from pathname and params
 */
export function getRouteTypeFromPath(
  pathname: string,
  params: Record<string, string | undefined> = {}
): ROUTE_TYPES {
  // Remove basename if present
  let cleanPath = pathname
  if (PATH_BASENAME && pathname.startsWith(PATH_BASENAME)) {
    cleanPath = pathname.slice(PATH_BASENAME.length) || '/'
  }

  // Normalize path
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath
  }

  // Try exact matches first
  if (cleanPath === '/index' || cleanPath === '/') return HOME
  if (cleanPath === '/user') return USER
  if (cleanPath === '/vessel-search') return SEARCH

  // Pattern matching for parameterized routes
  if (cleanPath.startsWith('/report/') && params.reportId) return REPORT
  if (cleanPath.startsWith('/vessel/') && params.vesselId) return VESSEL

  // Category-based routes
  if (params.category) {
    if (params.portId) return PORT_REPORT
    if (params.vesselGroupId) return VESSEL_GROUP_REPORT
    if (params.areaId || params.datasetId) return WORKSPACE_REPORT
    if (params.vesselId && cleanPath.includes('/vessel/')) return WORKSPACE_VESSEL
    if (cleanPath.includes('/vessel-search')) return WORKSPACE_SEARCH
    if (params.workspaceId) return WORKSPACE
    return WORKSPACES_LIST
  }

  // Default to HOME if no match
  return HOME
}

/**
 * Extract payload from route params
 */
export function extractPayloadFromParams(params: Record<string, string | undefined>): LinkToPayload {
  return {
    reportId: params.reportId,
    vesselId: params.vesselId,
    category: params.category,
    workspaceId: params.workspaceId,
    datasetId: params.datasetId,
    areaId: params.areaId,
    vesselGroupId: params.vesselGroupId,
    portId: params.portId,
  }
}

/**
 * Build search params with workspace serialization
 */
export function buildSearchParams(
  query: QueryParams = {},
  replaceQuery: boolean = false,
  currentQuery: QueryParams = {}
): string {
  const finalQuery = replaceQuery ? query : { ...currentQuery, ...query }
  return stringifyWorkspace(finalQuery)
}

/**
 * Parse search params with workspace deserialization
 */
export function parseSearchParams(search: string): QueryParams {
  return parseWorkspace(search, {
    reportAreaBounds: (reportAreaBounds: string[]) =>
      reportAreaBounds?.map((bound: string) => parseFloat(bound)),
  })
}

/**
 * Get full path with basename
 */
export function getFullPath(path: string): string {
  if (PATH_BASENAME && PATH_BASENAME !== '/') {
    const basename = PATH_BASENAME.endsWith('/') ? PATH_BASENAME.slice(0, -1) : PATH_BASENAME
    return basename + (path.startsWith('/') ? path : '/' + path)
  }
  return path
}

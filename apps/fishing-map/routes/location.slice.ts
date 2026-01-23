import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { PATH_BASENAME } from 'data/config'
import type { QueryParams } from 'types'

import type { ROUTE_TYPES } from './routes'
import {
  extractPayloadFromParams,
  getRouteTypeFromPath,
  parseSearchParams,
} from './router.utils'

// Query type matching Redux First Router's Query type
export type Query = Record<string, any>

// Location state structure matching Redux First Router's location state
export interface LocationState {
  type: ROUTE_TYPES | 'NOT_FOUND'
  query: Query
  payload: Record<string, any>
  pathname: string
  prev?: {
    type: ROUTE_TYPES | 'NOT_FOUND'
    query: Query
    payload: Record<string, any>
    pathname: string
  }
}

/**
 * Initialize location state from current URL (client-side only)
 * This ensures the viewport and other URL params are available immediately on page load
 */
function getInitialLocationState(): LocationState {
  if (typeof window === 'undefined') {
    return {
      type: 'HOME',
      query: {},
      payload: {},
      pathname: '/index',
    }
  }

  const pathname = window.location.pathname
  const search = window.location.search.slice(1) // Remove '?'
  
  // Remove basename from pathname if present
  let cleanPathname = pathname
  const basename = PATH_BASENAME || ''
  if (basename && basename !== '/' && pathname.startsWith(basename)) {
    cleanPathname = pathname.slice(basename.length) || '/'
  }
  
  // Parse URL path to extract params manually
  const pathParts = cleanPathname.split('/').filter(Boolean)
  const params: Record<string, string | undefined> = {}
  
  // Extract params based on path patterns
  if (pathParts[0] === 'index' || cleanPathname === '/' || cleanPathname === '/index') {
    // HOME route
  } else if (pathParts[0] === 'user') {
    // USER route
  } else if (pathParts[0] === 'vessel-search') {
    // SEARCH route
  } else if (pathParts[0] === 'report' && pathParts[1]) {
    params.reportId = pathParts[1]
  } else if (pathParts[0] === 'vessel' && pathParts[1]) {
    params.vesselId = pathParts[1]
  } else if (pathParts[0]) {
    // Category-based routes
    params.category = pathParts[0]
    if (pathParts[1]) params.workspaceId = pathParts[1]
    if (pathParts[2] === 'vessel-search') {
      // WORKSPACE_SEARCH
    } else if (pathParts[2] === 'vessel' && pathParts[3]) {
      params.vesselId = pathParts[3]
    } else if (pathParts[2] === 'report') {
      if (pathParts[3]) params.datasetId = pathParts[3]
      if (pathParts[4]) params.areaId = pathParts[4]
    } else if (pathParts[2] === 'vessel-group-report' && pathParts[3]) {
      params.vesselGroupId = pathParts[3]
    } else if (pathParts[2] === 'ports-report' && pathParts[3]) {
      params.portId = pathParts[3]
    }
  }
  
  const routeType = getRouteTypeFromPath(cleanPathname, params as Record<string, string>)
  const payload = extractPayloadFromParams(params)
  const query = search ? parseSearchParams(search) : {}

  return {
    type: routeType,
    query: query as any,
    payload,
    pathname: cleanPathname,
  }
}

const initialState: LocationState = getInitialLocationState()

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Partial<LocationState>>) => {
      state.prev = {
        type: state.type,
        query: state.query,
        payload: state.payload,
        pathname: state.pathname,
      }
      if (action.payload.type !== undefined) state.type = action.payload.type
      if (action.payload.query !== undefined) state.query = action.payload.query
      if (action.payload.payload !== undefined) state.payload = action.payload.payload
      if (action.payload.pathname !== undefined) state.pathname = action.payload.pathname
    },
    updateQuery: (state, action: PayloadAction<QueryParams>) => {
      state.query = { ...state.query, ...action.payload } as Query
    },
    updatePayload: (state, action: PayloadAction<Record<string, any>>) => {
      state.payload = { ...state.payload, ...action.payload }
    },
  },
})

export const { setLocation, updateQuery, updatePayload } = locationSlice.actions
export default locationSlice.reducer

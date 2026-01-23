import type { RootState } from 'reducers'

import type { TimeRange } from 'features/timebar/timebar.slice'
import type { AppDispatch } from 'store'
import type { QueryParams, WorkspaceViewport } from 'types'

import { router } from './router'
import { buildSearchParams, linkToToPath, parseSearchParams } from './router.utils'
import type { ROUTE_TYPES } from './routes'
import { selectLocationPayload, selectLocationQuery, selectLocationType } from './routes.selectors'

export interface UpdateQueryParamsAction {
  type: ROUTE_TYPES | 'NOT_FOUND'
  query?: QueryParams
  isHistoryNavigation?: boolean
  skipHistoryNavigation?: boolean
  replaceQuery?: boolean
  replaceUrl?: boolean
  payload?: any
  prev?: any
  meta?: {
    location: {
      kind: string
    }
  }
}

type UpdateLocationOptions = Pick<
  UpdateQueryParamsAction,
  | 'query'
  | 'payload'
  | 'replaceQuery'
  | 'replaceUrl'
  | 'isHistoryNavigation'
  | 'skipHistoryNavigation'
>

export function updateLocation(
  type: ROUTE_TYPES,
  {
    query = {},
    payload = {},
    replaceQuery = false,
    replaceUrl = false,
    isHistoryNavigation = false,
    skipHistoryNavigation = false,
  } = {} as UpdateLocationOptions
) {
  // Check if we need to confirm leave (for routes that had confirmLeave callback)
  // This needs to be done before navigation
  // We'll handle this in the navigation flow, but for now we proceed
  
  // Use browser history API directly since we're not using RouterProvider
  const path = linkToToPath(type, payload)
  const currentQuery = typeof window !== 'undefined' 
    ? (new URLSearchParams(window.location.search).toString() ? parseSearchParams(window.location.search.slice(1)) : {})
    : {}
  const searchParamsString = buildSearchParams(query, replaceQuery, currentQuery)
  
  // Build full URL with search params (including basename)
  const basename = router.options.basepath || ''
  const fullPath = searchParamsString ? `${path}?${searchParamsString}` : path
  const fullUrl = basename && basename !== '/' ? `${basename}${fullPath}` : fullPath
  
  // Navigate using browser history API
  // Trigger popstate event to sync with RouterReduxConnector
  if (typeof window !== 'undefined') {
    if (replaceUrl) {
      window.history.replaceState({}, '', fullUrl)
    } else {
      window.history.pushState({}, '', fullUrl)
    }
    // Dispatch popstate event to trigger RouterReduxConnector sync
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Return action for backward compatibility (middlewares may still use it)
  return {
    type,
    query,
    payload,
    replaceQuery,
    replaceUrl,
    isHistoryNavigation,
    skipHistoryNavigation,
  }
}

export function updateQueryParam(query: QueryParams = {}) {
  return (dispatch: AppDispatch, getState: () => unknown) => {
    const state = getState() as RootState
    const locationType = selectLocationType(state)
    const payload = selectLocationPayload(state)
    return dispatch(updateLocation(locationType, { query, payload, replaceQuery: false }))
  }
}

const cleanQueryLocation = () => {
  return (dispatch: AppDispatch, getState: () => unknown) => {
    const state = getState() as RootState
    const locationType = selectLocationType(state)
    const payload = selectLocationPayload(state)
    return dispatch(updateLocation(locationType, { query: undefined, payload, replaceQuery: true }))
  }
}

// Why this works the other way around ? with the dispatch and getState firt in params ??
const updateUrlViewport: any = (dispatch: AppDispatch, getState: () => RootState) => {
  return (viewport: WorkspaceViewport) => {
    const state = getState()
    const locationType = selectLocationType(state)
    const payload = selectLocationPayload(state)
    // Use updateLocation which handles navigation properly
    dispatch(
      updateLocation(locationType, { query: { ...viewport }, payload, skipHistoryNavigation: true })
    )
  }
}

const updateUrlTimerange: any = (dispatch: AppDispatch, getState: () => RootState) => {
  return (timerange: TimeRange) => {
    const state = getState()
    const locationType = selectLocationType(state)
    const payload = selectLocationPayload(state)
    const query = selectLocationQuery(state)
    // Use updateLocation which handles navigation properly
    dispatch(
      updateLocation(locationType, {
        query: { ...query, ...timerange },
        payload,
        skipHistoryNavigation: true,
      })
    )
  }
}

export { cleanQueryLocation, updateUrlViewport, updateUrlTimerange }

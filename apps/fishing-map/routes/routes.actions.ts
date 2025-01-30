import type { RootState } from 'reducers'

import type { TimeRange } from 'features/timebar/timebar.slice'
import type { AppDispatch } from 'store'
import type { QueryParams, WorkspaceViewport } from 'types'

import type { ROUTE_TYPES } from './routes'
import { selectLocationPayload, selectLocationQuery, selectLocationType } from './routes.selectors'

export interface UpdateQueryParamsAction {
  type: ROUTE_TYPES
  query?: QueryParams
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
  'query' | 'payload' | 'replaceQuery' | 'replaceUrl'
>

export function updateLocation(
  type: ROUTE_TYPES,
  {
    query = {},
    payload = {},
    replaceQuery = false,
    replaceUrl = false,
  } = {} as UpdateLocationOptions
) {
  return { type, query, payload, replaceQuery, replaceUrl }
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
    dispatch(updateLocation(locationType, { query: { ...viewport }, payload }))
  }
}

const updateUrlTimerange: any = (dispatch: AppDispatch, getState: () => RootState) => {
  return (timerange: TimeRange) => {
    const state = getState()
    const locationType = selectLocationType(state)
    const payload = selectLocationPayload(state)
    const query = selectLocationQuery(state)
    dispatch(updateLocation(locationType, { query: { ...query, ...timerange }, payload }))
  }
}

export { cleanQueryLocation, updateUrlViewport, updateUrlTimerange }

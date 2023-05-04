import { RootState } from 'reducers'
import { Range } from 'features/timebar/timebar.slice'
import { AppDispatch } from 'store'
import { QueryParams, WorkspaceViewport } from 'types'
import { ROUTE_TYPES } from './routes'
import {
  selectCurrentLocation,
  selectLocationPayload,
  selectLocationQuery,
} from './routes.selectors'

export interface UpdateQueryParamsAction {
  type: ROUTE_TYPES
  query: QueryParams
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
    const location = selectCurrentLocation(state)
    const payload = selectLocationPayload(state)
    return dispatch(updateLocation(location.type, { query, payload, replaceQuery: false }))
  }
}

const cleanQueryLocation = () => {
  return (dispatch: AppDispatch, getState: () => unknown) => {
    const state = getState() as RootState
    const location = selectCurrentLocation(state)
    const payload = selectLocationPayload(state)
    return dispatch(
      updateLocation(location.type, { query: undefined, payload, replaceQuery: true })
    )
  }
}

// Why this works the other way around ? with the dispatch and getState firt in params ??
const updateUrlViewport: any = (dispatch: AppDispatch, getState: () => RootState) => {
  return (viewport: WorkspaceViewport) => {
    const state = getState()
    const location = selectCurrentLocation(state)
    const payload = selectLocationPayload(state)
    dispatch(updateLocation(location.type, { query: { ...viewport }, payload }))
  }
}

const updateUrlTimerange: any = (dispatch: AppDispatch, getState: () => RootState) => {
  return (timerange: Range) => {
    const state = getState()
    const location = selectCurrentLocation(state)
    const payload = selectLocationPayload(state)
    const query = selectLocationQuery(state)
    dispatch(updateLocation(location.type, { query: { ...query, ...timerange }, payload }))
  }
}

export { cleanQueryLocation, updateUrlViewport, updateUrlTimerange }

import { WorkspaceViewport } from '@globalfishingwatch/api-types'
import { AppDispatch, RootState } from 'store'
import { QueryParams } from 'types'
import { HOME, ROUTE_TYPES } from './routes'
import {
  selectCurrentLocation,
  selectLocationPayload,
  selectLocationQuery,
} from './routes.selectors'

export interface UpdateQueryParamsAction {
  type: ROUTE_TYPES
  query: QueryParams
  replaceQuery?: boolean
  payload?: any
  prev?: any
  meta?: {
    location: {
      kind: string
    }
  }
}

type UpdateLocationOptions = { query?: QueryParams; payload?: any; replaceQuery?: boolean }

export function updateQueryParams(query: QueryParams): UpdateQueryParamsAction {
  return { type: HOME, query }
}
export function updateLocation(
  type: ROUTE_TYPES,
  { query = {}, payload = {}, replaceQuery = false }: UpdateLocationOptions = {}
) {
  return { type, query, payload, replaceQuery }
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
  return (timerange: any) => {
    const state = getState()
    const location = selectCurrentLocation(state)
    const payload = selectLocationPayload(state)
    const query = selectLocationQuery(state)
    dispatch(updateLocation(location.type, { query: { ...query, ...timerange }, payload }))
  }
}

export { cleanQueryLocation, updateUrlViewport, updateUrlTimerange }

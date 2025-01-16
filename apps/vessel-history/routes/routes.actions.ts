import type { AppDispatch, RootState } from 'store'
import type { QueryParams } from 'types'

import type { WorkspaceViewport } from '@globalfishingwatch/api-types'

import type { ROUTE_TYPES} from './routes';
import { HOME, PROFILE } from './routes'
import { selectCurrentLocation, selectLocationPayload } from './routes.selectors'

export interface UpdateQueryParamsAction {
  type: ROUTE_TYPES
  query: QueryParams
  replaceQuery?: boolean
  payload?: any
  meta?: {
    location: {
      kind: string
    }
  }
}

type UpdateLocationOptions = { query?: QueryParams; payload?: any; replaceQuery?: boolean }
export function updateLocation(
  type: ROUTE_TYPES,
  { query = {}, payload = {}, replaceQuery = false }: UpdateLocationOptions = {}
) {
  return { type, query, payload, replaceQuery }
}

export function updateQueryParams(query: QueryParams): UpdateQueryParamsAction {
  return { type: HOME, query }
}

export function updateProfileParams(query: QueryParams): UpdateQueryParamsAction {
  return { type: PROFILE, query }
}

// Why this works the other way around ? with the dispatch and getState firt in params ??
export const updateUrlViewport: any = (dispatch: AppDispatch, getState: () => RootState) => {
  return (viewport: WorkspaceViewport) => {
    const state = getState()
    const location = selectCurrentLocation(state)
    const payload = selectLocationPayload(state)
    dispatch(updateLocation(location.type, { query: { ...viewport }, payload }))
  }
}

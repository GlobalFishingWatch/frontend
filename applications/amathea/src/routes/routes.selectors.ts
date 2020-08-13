import { createSelector } from 'reselect'
import { RootState } from 'store'
import { Query } from 'redux-first-router'
import { WorkspaceParam } from 'types'
import { DEFAULT_WORKSPACE } from 'data/config'
import { LocationRoute, ROUTE_TYPES, WORKSPACE_EDITOR } from './routes'

const selectLocation = (state: RootState) => state.location

export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as LocationRoute
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const isWorkspaceEditorPage = createSelector([selectCurrentLocation], ({ type }) => {
  return type === WORKSPACE_EDITOR
})

export const selectLocationPayload = createSelector([selectLocation], ({ payload }) => {
  return payload
})

export const selectCurrentWorkspaceId = createSelector([selectLocation], ({ payload }) => {
  return payload?.workspaceId as number
})

const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query as Query
})

const selectQueryParam = <T = any>(param: WorkspaceParam) =>
  createSelector<RootState, Query, T>([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const selectMapZoomQuery = selectQueryParam<number>('zoom')
export const selectMapLatitudeQuery = selectQueryParam<number>('latitude')
export const selectMapLongitudeQuery = selectQueryParam<number>('longitude')
export const selectStartQuery = selectQueryParam<string>('start')
export const selectEndQuery = selectQueryParam<string>('end')

export const selectViewport = createSelector(
  [selectMapZoomQuery, selectMapLatitudeQuery, selectMapLongitudeQuery],
  (zoom, latitude, longitude) => ({
    zoom,
    latitude,
    longitude,
  })
)

export const selectTimerange = createSelector([selectStartQuery, selectEndQuery], (start, end) => ({
  start,
  end,
}))

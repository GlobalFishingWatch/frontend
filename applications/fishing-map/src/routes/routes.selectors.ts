import { createSelector } from 'reselect'
import { Query, RouteObject } from 'redux-first-router'
import { RootState } from 'store'
import { WorkspaceParam, UrlDataviewInstance } from 'types'
import { DEFAULT_WORKSPACE, DEFAULT_WERSION } from 'data/config'
import { ROUTE_TYPES } from './routes'

const selectLocation = (state: RootState) => state.location
export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as RouteObject
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const selectLocationQuery = createSelector(
  [selectLocation],
  (location) => location.query as Query
)

export const selectLocationPayload = createSelector([selectLocation], ({ payload }) => payload)
export const selectVersion = createSelector(
  [selectLocationPayload],
  (payload) => payload.version || DEFAULT_WERSION
)
export const selectWorkspaceId = createSelector(
  [selectLocationPayload],
  (payload) => payload.workspaceId
)

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
export const selectSearchQuery = selectQueryParam<string>('query')
export const selectDataviewInstances = selectQueryParam<UrlDataviewInstance[]>('dataviewInstances')

export const selectTimerange = createSelector([selectStartQuery, selectEndQuery], (start, end) => ({
  start,
  end,
}))

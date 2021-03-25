import { createSelector } from 'reselect'
import memoize from 'lodash/memoize'
import { Query, RouteObject } from 'redux-first-router'
import { RootState } from 'store'
import { WorkspaceParam, UrlDataviewInstance } from 'types'
import { DEFAULT_VERSION } from 'data/config'
import { WorkspaceCategories } from 'data/workspaces'
import { HOME, ROUTE_TYPES, WORKSPACE } from './routes'

const selectLocation = (state: RootState) => state.location
export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as RouteObject
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const selectLocationType = createSelector(
  [selectLocation],
  (location) => location.type as ROUTE_TYPES
)

export const isWorkspaceLocation = createSelector(
  [selectLocationType],
  (locationType) => locationType === WORKSPACE || locationType === HOME
)

export const selectLocationQuery = createSelector(
  [selectLocation],
  (location) => location.query as Query
)

export const selectQueryParam = <T = any>(param: WorkspaceParam) =>
  createSelector<RootState, Query, T>([selectLocationQuery], (query: any) => {
    return query?.[param]
  })

export const selectLocationPayload = createSelector([selectLocation], ({ payload }) => payload)
export const selectVersion = createSelector(
  [selectQueryParam('version')],
  (version: string) => version || DEFAULT_VERSION
)

export const selectWorkspaceId = createSelector(
  [selectLocationPayload],
  (payload) => payload?.workspaceId
)

export const selectLocationCategory = createSelector(
  [selectLocationPayload],
  (payload) => payload?.category as WorkspaceCategories
)

export const isValidLocationCategory = createSelector(
  [selectLocationCategory],
  (locationCategory) => Object.values(WorkspaceCategories).includes(locationCategory)
)

export const selectUrlMapZoomQuery = selectQueryParam<number>('zoom')
export const selectUrlMapLatitudeQuery = selectQueryParam<number>('latitude')
export const selectUrlMapLongitudeQuery = selectQueryParam<number>('longitude')
export const selectUrlStartQuery = selectQueryParam<string>('start')
export const selectUrlEndQuery = selectQueryParam<string>('end')
export const selectUrlDataviewInstances = selectQueryParam<UrlDataviewInstance[]>(
  'dataviewInstances'
)

export const selectUrlViewport = createSelector(
  [selectUrlMapZoomQuery, selectUrlMapLatitudeQuery, selectUrlMapLongitudeQuery],
  (zoom, latitude, longitude) => {
    if (!zoom && !latitude && !longitude) return
    return { zoom, latitude, longitude }
  }
)

export const selectUrlTimeRange = createSelector(
  [selectUrlStartQuery, selectUrlEndQuery],
  (start, end) => {
    return { start, end }
  }
)

export const selectUrlDataviewInstancesById = memoize((id: string) =>
  createSelector([selectUrlDataviewInstances], (urlDataviewInstances) =>
    urlDataviewInstances?.find((dataviewInstance) => dataviewInstance.id === id)
  )
)

import { createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { Query, RouteObject } from 'redux-first-router'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store'
import { WorkspaceParam } from 'types'
import { WorkspaceCategories } from 'data/workspaces'
import { ROUTE_TYPES, WORKSPACE_ROUTES } from './routes'

const selectLocation = (state: RootState) => state.location
export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as RouteObject
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const selectLocationType = createSelector(
  [selectLocation],
  (location) => location.type as ROUTE_TYPES
)

export const isWorkspaceLocation = createSelector([selectLocationType], (locationType) =>
  WORKSPACE_ROUTES.includes(locationType)
)

export const selectLocationQuery = createSelector(
  [selectLocation],
  (location) => location.query as Query
)

export const selectQueryParam = <T = any>(param: WorkspaceParam) =>
  createSelector([selectLocationQuery], (query: any): T => {
    return query?.[param]
  })

export const selectLocationPayload = createSelector([selectLocation], ({ payload }) => payload)

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

export const isMarineManagerLocation = createSelector(
  [selectLocationCategory],
  (category) => category === WorkspaceCategories.MarineManager
)

export const selectUrlMapZoomQuery = selectQueryParam<number>('zoom')
export const selectUrlMapLatitudeQuery = selectQueryParam<number>('latitude')
export const selectUrlMapLongitudeQuery = selectQueryParam<number>('longitude')
export const selectUrlStartQuery = selectQueryParam<string>('start')
export const selectUrlEndQuery = selectQueryParam<string>('end')
export const selectUrlDataviewInstances =
  selectQueryParam<UrlDataviewInstance[]>('dataviewInstances')

export const selectUrlDataviewInstancesOrder =
  selectQueryParam<UrlDataviewInstance['id'][]>('dataviewInstancesOrder')

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
    if (!start || !end) return null
    return { start, end }
  }
)

export const selectUrlDataviewInstancesById = memoize((id: string) =>
  createSelector([selectUrlDataviewInstances], (urlDataviewInstances) =>
    urlDataviewInstances?.find((dataviewInstance) => dataviewInstance.id === id)
  )
)

import { createSelector } from '@reduxjs/toolkit'
import type { Query, RouteObject } from 'redux-first-router'
import type { RootState } from 'store'
import type { WorkspaceParam } from 'types'

import { DEFAULT_WORKSPACE } from 'data/config'

import type { ROUTE_TYPES } from './routes'

const selectLocation = (state: RootState) => state.location
export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as RouteObject
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const selectLocationType = createSelector(
  [selectLocation],
  (location) => location.type as ROUTE_TYPES
)

export const selectLocationQuery = createSelector(
  [selectLocation],
  (location) => location.query as Query
)

export const selectQueryParam = <T = any>(param: WorkspaceParam) =>
  createSelector([selectLocationQuery], (query: any): T => {
    return query?.[param] ?? DEFAULT_WORKSPACE[param]
  })

export const selectLocationPayload = createSelector([selectLocation], ({ payload }) => payload)
export const selectUrlMapZoomQuery = selectQueryParam<number>('zoom')
export const selectSatellite = selectQueryParam('satellite')
export const selectUrlMapLatitudeQuery = selectQueryParam<number>('latitude')
export const selectUrlMapLongitudeQuery = selectQueryParam<number>('longitude')
export const selectUrlStartQuery = selectQueryParam<string>('start')
export const selectUrlEndQuery = selectQueryParam<string>('end')
export const selectSidebarOpen = selectQueryParam<boolean>('sidebarOpen')

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

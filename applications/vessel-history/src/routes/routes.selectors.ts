import { createSelector } from '@reduxjs/toolkit'
import { RouteObject } from 'redux-first-router'
import { DEFAULT_WORKSPACE } from 'data/config'
import { formatVesselProfileId } from 'features/vessels/vessels.utils'
import { RootState } from 'store'
import { WorkspaceParam } from 'types'
import { ROUTE_TYPES } from './routes'

const selectLocation = (state: RootState) => state.location
export const selectCurrentLocation = createSelector([selectLocation], ({ type, routesMap }) => {
  const routeMap = routesMap[type] as RouteObject
  return { type: type as ROUTE_TYPES, ...routeMap }
})

export const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query
})

export const getLocationType = createSelector([selectLocation], (location) => {
  return location.type
})

export const selectLocationPayload = createSelector([selectLocation], ({ payload }) => payload)

export const selectVesselId = createSelector([selectLocationPayload], (payload) => {
  return payload.vesselID !== 'NA' ? payload.vesselID : null
})

export const selectTmtId = createSelector([selectLocationPayload], (payload) => {
  return payload.tmtID !== 'NA' ? payload.tmtID : null
})

export const selectDataset = createSelector([selectLocationPayload], (payload) => {
  return payload.dataset
})

export const selectVesselProfileId = createSelector(
  [selectDataset, selectVesselId, selectTmtId],
  formatVesselProfileId
)

export const selectQueryParam = (param: WorkspaceParam) =>
  createSelector([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

//export const selectDataviewsQuery = selectQueryParam<any[]>('workspaceDataviews')

export const selectMapZoomQuery = selectQueryParam('zoom')
export const selectMapLatitudeQuery = selectQueryParam('latitude')
export const selectMapLongitudeQuery = selectQueryParam('longitude')
export const selectStartQuery = selectQueryParam('start')
export const selectEndQuery = selectQueryParam('end')
export const selectVessel = selectQueryParam('vessel')

/**
 * get the start and end dates in string format
 */
export const getDateRange = createSelector([selectStartQuery, selectEndQuery], (start, end) => ({
  start,
  end,
}))

/**
 * get the start and end dates in timestamp format
 */
export const getDateRangeTS = createSelector([selectStartQuery, selectEndQuery], (start, end) => ({
  start: new Date(start).getTime(),
  end: new Date(end).getTime(),
}))

/**
 * Get the hidden layers in the map
 */
export const selectHiddenLayers = createSelector(
  [selectQueryParam('hiddenLayers')],
  (hiddenLayers) => hiddenLayers.split(',')
)
export const selectSatellite = selectQueryParam('satellite')
export const selectColorMode = selectQueryParam('colorMode')

// export const selectViewport = createSelector(
//   [selectMapZoomQuery, selectMapLatitudeQuery, selectMapLongitudeQuery, selectColorMode],
//   (zoom, latitude, longitude, colorMode) => ({
//     zoom,
//     latitude,
//     longitude,
//     colorMode,
//   })
// )

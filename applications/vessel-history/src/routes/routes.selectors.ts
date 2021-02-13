import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { WorkspaceParam } from 'types'
import { AppState } from 'types/redux.types'

const selectLocation = (state: RootState) => state.location

export const DEFAULT_WORKSPACE: AppState = {
  //workspaceDataviews: DEFAULT_DATAVIEWS,
  zoom: 3,
  latitude: -25.54035,
  longitude: -35.97144,
  project: '1',
  start: '2017-12-01T00:00:00.000Z',
  end: '2018-01-01T00:00:00.000Z',
  timebarMode: 'speed',
}

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
  (dataset, vesselID, tmtID) => {
    return `${dataset}_${vesselID}_${tmtID}`
  }
)

export const selectQueryParam = <T = any>(param: WorkspaceParam) =>
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

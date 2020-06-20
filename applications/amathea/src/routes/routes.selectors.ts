import { createSelector } from 'reselect'
import { RootState } from 'store'
import { WorkspaceParam } from 'types'
import { DEFAULT_WORKSPACE } from 'data/config'

const selectLocation = (state: RootState) => state.location

const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query
})

const selectQueryParam = (param: WorkspaceParam) =>
  createSelector([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param]
    }
    return query[param]
  })

export const selectMapZoomQuery = selectQueryParam('zoom')
export const selectMapLatitudeQuery = selectQueryParam('latitude')
export const selectMapLongitudeQuery = selectQueryParam('longitude')
export const selectStartQuery = selectQueryParam('start')
export const selectEndQuery = selectQueryParam('end')

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

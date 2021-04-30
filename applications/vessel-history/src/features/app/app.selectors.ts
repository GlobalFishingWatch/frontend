import { createSelector } from '@reduxjs/toolkit'
import { DEFAULT_WORKSPACE } from 'data/config'
import { selectUrlViewport, selectUrlTimeRange } from 'routes/routes.selectors'

export const selectViewport = createSelector([selectUrlViewport], (urlViewport) => {
  return {
    zoom: urlViewport?.zoom || DEFAULT_WORKSPACE.zoom,
    latitude: urlViewport?.latitude || DEFAULT_WORKSPACE.latitude,
    longitude: urlViewport?.longitude || DEFAULT_WORKSPACE.longitude,
  }
})

export const selectTimeRange = createSelector([selectUrlTimeRange], ({ start, end }) => {
  return {
    start: start || DEFAULT_WORKSPACE.start,
    end: end || DEFAULT_WORKSPACE.end,
  }
})

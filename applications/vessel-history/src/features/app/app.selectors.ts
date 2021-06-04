import { createSelector } from '@reduxjs/toolkit'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { getDefaultWorkspace } from 'features/workspace/workspace.slice'
import { selectUrlViewport, selectUrlTimeRange } from 'routes/routes.selectors'

export const selectViewport = createSelector(
  [selectUrlViewport, selectWorkspace],
  (urlViewport, { viewport: { zoom, latitude, longitude } }) => {
    return {
      zoom: urlViewport?.zoom || zoom,
      latitude: urlViewport?.latitude || latitude,
      longitude: urlViewport?.longitude || longitude,
    }
  }
)

export const selectTimeRange = createSelector([selectUrlTimeRange], ({ start, end }) => ({
  start: start || getDefaultWorkspace().start,
  end: end || getDefaultWorkspace().end,
}))

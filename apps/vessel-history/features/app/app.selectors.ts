import { createSelector } from '@reduxjs/toolkit'

import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { getDefaultWorkspace } from 'features/workspace/workspace.slice'
import { selectUrlTimeRange,selectUrlViewport } from 'routes/routes.selectors'

export const selectViewport = createSelector(
  [selectUrlViewport, selectWorkspace],
  (urlViewport, { viewport }) => {
    return {
      zoom: urlViewport?.zoom || viewport?.zoom,
      latitude: urlViewport?.latitude || viewport?.latitude,
      longitude: urlViewport?.longitude || viewport?.longitude,
    }
  }
)

export const selectTimeRange = createSelector([selectUrlTimeRange], ({ start, end }) => ({
  start: start || getDefaultWorkspace().start,
  end: end || getDefaultWorkspace().end,
}))

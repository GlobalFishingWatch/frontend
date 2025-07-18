import { createSelector } from '@reduxjs/toolkit'

import { DEFAULT_WORKSPACE } from 'data/config'
import { selectWorkspaceViewport } from 'features/workspace/workspace.selectors'
import { selectUrlViewport } from 'routes/routes.selectors'

export const selectViewport = createSelector(
  [selectUrlViewport, selectWorkspaceViewport],
  (urlViewport, workspaceViewport) => {
    return {
      zoom: urlViewport?.zoom || workspaceViewport?.zoom || (DEFAULT_WORKSPACE.zoom as number),
      latitude:
        urlViewport?.latitude ||
        workspaceViewport?.latitude ||
        (DEFAULT_WORKSPACE.latitude as number),
      longitude:
        urlViewport?.longitude ||
        workspaceViewport?.longitude ||
        (DEFAULT_WORKSPACE.longitude as number),
    }
  }
)

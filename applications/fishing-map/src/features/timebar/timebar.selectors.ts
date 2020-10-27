import { createSelector } from '@reduxjs/toolkit'
import { selectStartQuery, selectEndQuery } from 'routes/routes.selectors'
import { selectWorkspaceTimeRange } from 'features/workspace/workspace.selectors'

export const selectTimeRange = createSelector(
  [selectStartQuery, selectEndQuery, selectWorkspaceTimeRange],
  (start, end, workspaceTimerange) => {
    return {
      start: start || workspaceTimerange?.start || '',
      end: end || workspaceTimerange?.end || '',
    }
  }
)

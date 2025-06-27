import { createSelector } from '@reduxjs/toolkit'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectWorkspacesTrackCorrectionIssues } from 'features/track-correction/track-correction.slice'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
import { selectTrackCorrectionId } from 'routes/routes.selectors'

export const selectTrackCorrectionOpen = createSelector(
  [selectTrackCorrectionId],
  (trackCorrectionId) => {
    return trackCorrectionId !== undefined && trackCorrectionId !== ''
  }
)

export const selectIsNewTrackCorrection = createSelector(
  [selectTrackCorrectionId],
  (trackCorrectionId) => {
    return trackCorrectionId === 'new'
  }
)

export const selectAllTrackCorrectionIssues = createSelector(
  [selectWorkspacesTrackCorrectionIssues, selectCurrentWorkspaceId],
  (workspacesIssues, workspaceId) => {
    if (!workspaceId) {
      return
    }
    return workspacesIssues[workspaceId]?.data
  }
)

export const selectCurrentTrackCorrectionIssue = createSelector(
  [selectTrackCorrectionId, selectAllTrackCorrectionIssues],
  (trackCorrectionId, trackCorrectionIssues) => {
    return trackCorrectionIssues?.find((issue) => issue.issueId === trackCorrectionId)
  }
)

export const selectTrackCorrectionIssues = createSelector(
  [selectAllTrackCorrectionIssues, selectTimeRange],
  (trackCorrectionIssues, timeRange) => {
    return trackCorrectionIssues?.filter((issue) => {
      return issue.startDate >= timeRange.start && issue.endDate <= timeRange.end
    })
  }
)

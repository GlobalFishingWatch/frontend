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

export const selectWorkspaceTrackCorrectionIssues = createSelector(
  [selectWorkspacesTrackCorrectionIssues, selectCurrentWorkspaceId],
  (workspacesIssues, workspaceId) => {
    if (!workspaceId) {
      return
    }
    return workspacesIssues[workspaceId]
  }
)

export const selectAllTrackCorrectionIssues = createSelector(
  [selectWorkspaceTrackCorrectionIssues],
  (workspacesIssues) => {
    return workspacesIssues?.data || []
  }
)

export const selectTrackCorrectionStatus = createSelector(
  [selectWorkspaceTrackCorrectionIssues],
  (workspacesIssues) => {
    return workspacesIssues?.status
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
      return (
        issue.startDate &&
        issue.endDate &&
        issue.startDate <= timeRange.end &&
        issue.endDate >= timeRange.start
      )
    })
  }
)

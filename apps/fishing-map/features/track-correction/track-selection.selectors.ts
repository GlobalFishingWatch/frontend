import { createSelector } from '@reduxjs/toolkit'

import { selectTrackCorrectionId } from 'routes/routes.selectors'

export const selectTrackCorrectionModalOpen = createSelector(
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

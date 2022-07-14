import { createSelector } from '@reduxjs/toolkit'
import { Area, selectAreas } from 'features/areas/areas.slice'
import { selectDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { selectDownloadTrackId } from 'features/download/downloadTrack.slice'

export const selectDownloadActivityArea = createSelector(
  [selectDownloadActivityAreaKey, selectAreas],
  (areaKey, areas): Area => {
    return areas[areaKey]
  }
)

export const selectDownloadTrackModalOpen = createSelector([selectDownloadTrackId], (trackId) => {
  return trackId !== ''
})

export const selectDownloadActivityModalOpen = createSelector(
  [selectDownloadActivityAreaKey],
  (areaKey) => {
    return areaKey !== ''
  }
)

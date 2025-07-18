import { createSelector } from '@reduxjs/toolkit'

import type { DatasetAreaDetail } from 'features/areas/areas.slice'
import { selectAreas } from 'features/areas/areas.slice'
import { selectDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { selectDownloadTrackIds } from 'features/download/downloadTrack.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

export const selectDownloadActivityArea = createSelector(
  [selectDownloadActivityAreaKey, selectAreas],
  (areaKey, areas): DatasetAreaDetail | undefined => {
    if (!areaKey || !areas) {
      return undefined
    }
    return areas[areaKey?.datasetId]?.detail?.[areaKey?.areaId]
  }
)

export const selectIsDownloadActivityAreaLoading = createSelector(
  [selectDownloadActivityArea],
  (area) => {
    return area?.status === AsyncReducerStatus.Loading
  }
)

export const selectDownloadTrackModalOpen = createSelector([selectDownloadTrackIds], (trackIds) => {
  return trackIds && trackIds?.length > 0
})

export const selectDownloadActivityModalOpen = createSelector(
  [selectDownloadActivityAreaKey],
  (areaKey) => {
    return areaKey !== undefined
  }
)

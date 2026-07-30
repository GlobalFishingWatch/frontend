import { createSelector } from '@reduxjs/toolkit'

import type { DatasetAreaDetail } from 'features/data/areas/areas.slice'
import { selectAreas } from 'features/data/areas/areas.slice'
import { selectDownloadActivityAreaKey } from 'features/map/download/downloadActivity.slice'
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

export const selectDownloadActivityModalOpen = createSelector(
  [selectDownloadActivityAreaKey],
  (areaKey) => {
    return areaKey !== undefined
  }
)

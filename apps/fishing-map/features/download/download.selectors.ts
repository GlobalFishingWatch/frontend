import { createSelector } from '@reduxjs/toolkit'
import { Area, selectAreas } from 'features/areas/areas.slice'
import { selectDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'

export const selectDownloadActivityArea = createSelector(
  [selectDownloadActivityAreaKey, selectAreas],
  (areaKey, areas): Area => {
    return areas[areaKey]
  }
)

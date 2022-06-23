import { createSelector } from '@reduxjs/toolkit'
import { selectRealTimeDataviews } from 'features/dataviews/dataviews.selectors'

export const selectRealTimeActive = createSelector(
  [selectRealTimeDataviews],
  (dataviews) =>
    dataviews && dataviews.length > 0 && dataviews.filter((d) => d.config?.visible).length > 0
)

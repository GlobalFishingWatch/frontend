import { createSelector } from '@reduxjs/toolkit'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getUserId } from 'features/user/user.slice'

export const selectUserDatasets = createSelector(
  [selectAllDatasets, getUserId],
  (datasets, userId) => datasets.filter((d) => d.ownerId === userId)
)

export const selectShared = createSelector([selectAllDatasets, getUserId], (datasets, userId) =>
  // TODO: make this real when editors in datasets API
  datasets.filter((d: any) => d.editors?.includes(userId))
)

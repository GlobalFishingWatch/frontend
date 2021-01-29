import { createSelector } from '@reduxjs/toolkit'
import { selectDatasets } from 'features/datasets/datasets.slice'
import { selectUserId } from 'features/user/user.selectors'

export const selectUserDatasets = createSelector(
  [selectDatasets, selectUserId],
  (datasets, userId) => datasets.filter((d) => d.ownerId === userId)
)

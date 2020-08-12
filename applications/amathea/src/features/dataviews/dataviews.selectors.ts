import { createSelector } from '@reduxjs/toolkit'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { selectAll as selectAllDatasets } from 'features/datasets/datasets.slice'
import { getUserId } from 'features/user/user.slice'
import { selectDrafDataviewSource } from './dataviews.slice'

export const selectDatasetOptionsBySource = createSelector(
  [selectAllDatasets, selectDrafDataviewSource, getUserId],
  (datasetOptions, source, userId): SelectOption[] => {
    const options = !source
      ? datasetOptions
      : datasetOptions.filter((dataset) => {
          if (source.id === 'gfw') {
            return dataset.ownerId !== userId
          }
          return dataset.ownerId === userId
        })
    return options.map((dataset) => ({ id: dataset.id, label: dataset.description }))
  }
)

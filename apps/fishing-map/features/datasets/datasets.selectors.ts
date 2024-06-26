import { createSelector } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DatasetCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import { selectAllDatasets } from './datasets.slice'

const EMPTY_ARRAY: [] = []

export const getDatasetsByDataview = (dataview: UrlDataviewInstance) =>
  Object.entries(dataview.datasetsConfig || {}).flatMap(([id, value]) => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === id)
    if (!dataset) return EMPTY_ARRAY
    return {
      id,
      label: dataset.name,
    }
  })

export const selectDatasetsByType = (type: DatasetTypes) => {
  return createSelector([selectAllDatasets], (datasets) => {
    return uniqBy(
      datasets.flatMap((dataset) => {
        if (dataset.type === type) return dataset
        const relatedDatasetId = dataset.relatedDatasets?.find(
          (relatedDataset) => relatedDataset.type === type
        )?.id
        if (!relatedDatasetId) return EMPTY_ARRAY
        const relatedDataset = datasets.find((dataset) => dataset.id === relatedDatasetId)
        return relatedDataset || []
      }),
      'id'
    )
  })
}

export const selectFourwingsDatasets = selectDatasetsByType(DatasetTypes.Fourwings)
export const selectVesselsDatasets = selectDatasetsByType(DatasetTypes.Vessels)
export const selectTracksDatasets = selectDatasetsByType(DatasetTypes.Tracks)

export const selectActivityDatasets = createSelector([selectFourwingsDatasets], (datasets) => {
  return datasets.filter((d) => d.category === DatasetCategory.Activity)
})

export const selectAllActivityDatasets = createSelector([selectAllDatasets], (datasets) => {
  return datasets.filter((d) => d.category === DatasetCategory.Activity)
})

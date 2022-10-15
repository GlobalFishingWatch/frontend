import { createSelector } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { selectDatasets } from './datasets.slice'

export const getDatasetsByDataview = (dataview: UrlDataviewInstance) =>
  Object.entries(dataview.datasetsConfig || {}).flatMap(([id, value]) => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === id)
    if (!dataset) return []
    return {
      id,
      label: dataset.name,
    }
  })

export const selectDatasetsByType = (type: DatasetTypes) => {
  return createSelector([selectDatasets], (datasets) => {
    return uniqBy(
      datasets.flatMap((dataset) => {
        if (dataset.type === type) return dataset
        const relatedDatasetId = dataset.relatedDatasets?.find(
          (relatedDataset) => relatedDataset.type === type
        )?.id
        if (!relatedDatasetId) return []
        const relatedDataset = datasets.find((dataset) => dataset.id === relatedDatasetId)
        return relatedDataset || []
      }),
      'id'
    )
  })
}

export const selectVesselsDatasets = createSelector(
  [selectDatasetsByType(DatasetTypes.Vessels)],
  (datasets) => {
    return datasets
  }
)
export const selectTracksDatasets = createSelector(
  [selectDatasetsByType(DatasetTypes.Tracks)],
  (datasets) => {
    return datasets
  }
)

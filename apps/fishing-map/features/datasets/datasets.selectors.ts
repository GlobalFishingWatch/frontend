import { createSelector } from '@reduxjs/toolkit'
import { uniqBy } from 'es-toolkit'

import { DatasetCategory, DatasetStatus, DatasetTypes } from '@globalfishingwatch/api-types'

import { isDatasetSearchFieldNeededSupported } from 'features/search/advanced/advanced-search.utils'
import { VESSEL_GROUPS_MIN_API_VERSION } from 'features/vessel-groups/vessel-groups.config'

import { selectAllDatasets, selectDeprecatedDatasets } from './datasets.slice'

const EMPTY_ARRAY: [] = []

const selectDatasetsByType = (type: DatasetTypes) => {
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
      (d) => d.id
    )
  })
}

export const selectFourwingsDatasets = selectDatasetsByType(DatasetTypes.Fourwings)
export const selectVesselsDatasets = selectDatasetsByType(DatasetTypes.Vessels)

export const selectVesselGroupCompatibleDatasets = createSelector(
  [selectVesselsDatasets, selectDeprecatedDatasets],
  (datasets, deprecatedDatasets) => {
    return datasets.filter(
      (d) =>
        d.status !== DatasetStatus.Deleted &&
        isDatasetSearchFieldNeededSupported(d) &&
        d.configuration?.apiSupportedVersions?.includes(VESSEL_GROUPS_MIN_API_VERSION) &&
        !deprecatedDatasets[d.id]
    )
  }
)

export const selectActivityDatasets = createSelector([selectFourwingsDatasets], (datasets) => {
  return datasets.filter((d) => d.category === DatasetCategory.Activity)
})

import { createSelector } from '@reduxjs/toolkit'

import { DatasetSubCategory } from '@globalfishingwatch/api-types'

import { VESSEL_TEMPLATE_DATAVIEW_SLUGS } from 'data/workspaces'
import { VMS_VESSEL_DATAVIEW_SLUGS } from 'data/workspaces-vms'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'

const VESSEL_TRACK_DATAVIEW_TEMPLATES = [
  ...VESSEL_TEMPLATE_DATAVIEW_SLUGS,
  ...Object.values(VMS_VESSEL_DATAVIEW_SLUGS),
]

// Needed another file to avoid circular dependency
export const selectVesselTemplateDataviews = createSelector(
  [selectAllDataviews],
  (vesselDataviews) => {
    return vesselDataviews?.filter((dataview) =>
      VESSEL_TRACK_DATAVIEW_TEMPLATES.includes(dataview.slug as any)
    )
  }
)

const selectActivityDataviewsBySubcategory = (subcategory: DatasetSubCategory) =>
  createSelector([selectAllDataviews, selectAllDatasets], (dataviews = [], allDatasets = []) => {
    return dataviews.filter((dataview) =>
      dataview.datasetsConfig?.some(
        (datasetConfig) =>
          allDatasets.find((dataset) => dataset.id === datasetConfig.datasetId)?.subcategory ===
          subcategory
      )
    )
  })

export const selectPresenceDataviews = selectActivityDataviewsBySubcategory(
  DatasetSubCategory.Presence
)

export const selectFishingDataviews = selectActivityDataviewsBySubcategory(
  DatasetSubCategory.Fishing
)

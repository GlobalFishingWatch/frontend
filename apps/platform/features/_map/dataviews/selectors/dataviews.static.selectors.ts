import { createSelector } from '@reduxjs/toolkit'

import { DatasetSubCategory } from '@globalfishingwatch/api-types'
import { getDataviewSlugForPipeVersion } from '@platform/config/map/dataviews'
import { getWorkspacePipeVersion } from '@platform/config/map/workspaces'

import { VESSEL_TEMPLATE_DATAVIEW_SLUGS, VMS_VESSEL_DATAVIEW_SLUGS } from 'data/map/dataviews'
import { selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import { selectAllDataviews } from 'features/_map/dataviews/dataviews.slice'
import { selectWorkspaceId } from 'router/routes.selectors'

const VESSEL_TRACK_DATAVIEW_TEMPLATES = [
  ...VESSEL_TEMPLATE_DATAVIEW_SLUGS,
  ...Object.values(VMS_VESSEL_DATAVIEW_SLUGS),
]

// Needed another file to avoid circular dependency
// A workspace pinned to an older pipe (`_v4` in its id) only offers that pipe's templates, so its
// vessels don't resolve against the current pipe's default info and events datasets
export const selectVesselTemplateDataviews = createSelector(
  [selectAllDataviews, selectWorkspaceId],
  (vesselDataviews, workspaceId) => {
    const pipeVersion = getWorkspacePipeVersion(workspaceId)
    const templateSlugs = VESSEL_TRACK_DATAVIEW_TEMPLATES.map((slug) =>
      getDataviewSlugForPipeVersion(slug, pipeVersion)
    )
    return vesselDataviews?.filter((dataview) => templateSlugs.includes(dataview.slug))
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

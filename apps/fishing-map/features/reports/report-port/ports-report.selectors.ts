import { createSelector } from '@reduxjs/toolkit'

import { EndpointId } from '@globalfishingwatch/api-types'

import {
  PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG,
  PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG,
} from 'data/workspaces'
import { selectAreas } from 'features/areas/areas.slice'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectReportPortId } from 'routes/routes.selectors'

export const selectPortReportFootprintDatasetId = createSelector(
  [selectAllDataviewInstancesResolved],
  (dataviews) => {
    if (!dataviews?.length) return null
    const footprintDataview = dataviews.find(
      (d) =>
        d.slug === PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG || d.slug === PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG
    )
    if (!footprintDataview) return null
    return footprintDataview.datasetsConfig?.find((d) => d.endpoint === EndpointId.ContextTiles)
      ?.datasetId
  }
)

export const selectPortReportFootprintArea = createSelector(
  [selectPortReportFootprintDatasetId, selectReportPortId, selectAreas],
  (datasetId, areaId, areas) => {
    if (!datasetId || !areaId || !areas) return null
    return areas?.[datasetId]?.detail?.[areaId]
  }
)

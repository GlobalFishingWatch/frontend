import { createSelector } from '@reduxjs/toolkit'

import { EndpointId } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

import {
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  PORTS_FOOTPRINT_DATAVIEW_SLUG,
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
} from 'data/workspaces'
import { selectAreas } from 'features/areas/areas.slice'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectReportPortId } from 'routes/routes.selectors'

export const selectPortReportsDataview = createSelector([selectEventsDataviews], (dataviews) => {
  if (!dataviews?.length) {
    return
  }
  return dataviews.find(({ dataviewId }) => dataviewId === CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG)
})

export const selectVesselDataviewTemplate = createSelector([selectAllDataviews], (dataviews) => {
  if (!dataviews?.length) {
    return
  }
  return dataviews.find(({ slug }) => slug === TEMPLATE_VESSEL_DATAVIEW_SLUG)
})

export const selectPortReportsConfidences = createSelector(
  [selectPortReportsDataview, selectVesselDataviewTemplate],
  (portReportDataview, vesselDataviewTemplate) => {
    if (!portReportDataview && !vesselDataviewTemplate) {
      return
    }
    let confidences: number[] = portReportDataview
      ? getDataviewFilters(portReportDataview)?.confidences
      : undefined
    if (confidences) {
      return confidences
    }
    confidences = vesselDataviewTemplate?.datasetsConfig
      ?.find((d) => d.datasetId.includes('port-visits'))
      ?.query?.find((q) => q.id === 'confidences')?.value as number[]
    return confidences
  }
)

export const selectPortReportFootprintDatasetId = createSelector(
  [selectAllDataviews],
  (dataviews) => {
    if (!dataviews?.length) return null
    const footprintDataview = dataviews.find((d) => d.slug === PORTS_FOOTPRINT_DATAVIEW_SLUG)
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

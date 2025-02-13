import { createSelector } from '@reduxjs/toolkit'
import type { ReportEventsVesselsParams } from 'queries/report-events-stats-api'
import {
  selectReportEventsStatsApiSlice,
  selectReportEventsVessels,
} from 'queries/report-events-stats-api'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import type { ReportVesselWithDatasets } from 'features/reports/report-area/area-reports.selectors'
import { selectReportPortId, selectReportVesselGroupId } from 'routes/routes.selectors'

export const selectFetchEventsVesselsParams = createSelector(
  [selectTimeRange, selectReportVesselGroupId, selectReportPortId, selectActiveReportDataviews],
  ({ start, end }, reportVesselGroupId, portId, eventsDataviews) => {
    if (!eventsDataviews?.[0]) {
      return
    }
    const eventsDataview = eventsDataviews?.[0]

    const dataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)?.id
    return {
      dataset: dataset,
      filters: {
        portId,
        vesselGroupId: reportVesselGroupId,
        ...getDataviewFilters(eventsDataview),
      },
      start,
      end,
    } as ReportEventsVesselsParams
  }
)

export const selectEventsVesselsData = createSelector(
  [selectReportEventsStatsApiSlice, selectFetchEventsVesselsParams],
  (reportEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectReportEventsVessels(params)({ reportEventsStatsApi })?.data
  }
)

export const selectEventsVessels = createSelector(
  [selectEventsVesselsData, selectActiveReportDataviews, selectAllDatasets],
  (eventsVessels, activeReportDataviews, allDatasets): ReportVesselWithDatasets[] | undefined => {
    if (!eventsVessels) {
      return
    }
    // TODO:CVP2 support multiple events report dataviews
    const eventsDataset = activeReportDataviews[0]?.datasets?.[0]
    const vesselDatasetId = eventsDataset?.relatedDatasets?.find(
      (d) => d.type === DatasetTypes.Vessels
    )?.id
    const vesselDataset = allDatasets?.find((d) => d.id === vesselDatasetId)
    const trackDatasetId = vesselDataset?.relatedDatasets?.find(
      (d) => d.type === DatasetTypes.Tracks
    )?.id
    const trackDataset = allDatasets?.find((d) => d.id === trackDatasetId)

    return eventsVessels.map((vessel) => ({
      ...vessel,
      // TODO:CVP2 support multiple events report dataviews
      dataviewId: activeReportDataviews?.[0]?.id,
      datasetId: vesselDataset?.id,
      infoDataset: vesselDataset,
      trackDataset: trackDataset,
      color: activeReportDataviews?.[0]?.config?.color || '',
      value: vessel.numEvents,
    }))
  }
)

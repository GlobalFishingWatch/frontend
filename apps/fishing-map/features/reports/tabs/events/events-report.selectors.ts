import { date } from '@recoiljs/refine'
import { createSelector } from '@reduxjs/toolkit'
import { groupBy, uniq } from 'es-toolkit'
import type { GetReportEventParams } from 'queries/report-events-stats-api'
import {
  selectReportEventsStats,
  selectReportEventsStatsApiSlice,
  selectReportEventsVessels,
} from 'queries/report-events-stats-api'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import {
  getDataviewFilters,
  getDataviewSqlFiltersResolved,
} from '@globalfishingwatch/dataviews-client'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import {
  type ReportVesselWithDatasets,
  selectReportAreaIds,
} from 'features/reports/report-area/area-reports.selectors'
import { WORLD_REGION_ID } from 'features/reports/tabs/activity/reports-activity.slice'
import { selectReportPortId, selectReportVesselGroupId } from 'routes/routes.selectors'

export const selectFetchEventsVesselsParams = createSelector(
  [
    selectTimeRange,
    selectReportAreaIds,
    selectReportVesselGroupId,
    selectReportPortId,
    selectActiveReportDataviews,
  ],
  ({ start, end }, reportAreaIds, reportVesselGroupId, portId, eventsDataviews) => {
    if (!eventsDataviews?.[0]) {
      return
    }

    const datasets = eventsDataviews?.flatMap(
      (dataview) => dataview.datasets?.find((d) => d.type === DatasetTypes.Events)?.id || []
    )
    const filters = eventsDataviews?.flatMap((dataview) => {
      return {
        portId,
        vesselGroupId: reportVesselGroupId,
        ...getDataviewFilters(dataview),
        // TODO:CVP2 add flags filter using this
        // sql: getDataviewSqlFiltersResolved(dataview),
      }
    })

    return {
      start,
      end,
      regionId: reportAreaIds.areaId !== WORLD_REGION_ID ? reportAreaIds.areaId : undefined,
      regionDataset: reportAreaIds.datasetId,
      filters,
      datasets,
    } as GetReportEventParams
  }
)

export const selectFetchEventsStatsParams = createSelector(
  [selectFetchEventsVesselsParams],
  (params) => {
    return {
      ...params,
      includes: ['TIME_SERIES'],
    } as GetReportEventParams
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

export const selectEventsStatsData = createSelector(
  [selectReportEventsStatsApiSlice, selectFetchEventsStatsParams],
  (reportEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectReportEventsStats(params)({ reportEventsStatsApi })?.data
  }
)

export const selectEventsStatsValueKeys = createSelector(
  [selectActiveReportDataviews],
  (dataviews) => {
    return dataviews.map((d) => d.id)
  }
)
export const selectEventsStats = createSelector(
  [selectEventsStatsData, selectActiveReportDataviews],
  (stats, dataviews) => {
    if (!stats) {
      return
    }
    const statsByDate = groupBy(
      stats.flatMap((s, i) =>
        s.timeseries.map((t) => ({
          date: t.date,
          dataviewId: dataviews[i].id,
          color: dataviews[i]?.config?.color,
          value: t.value,
        }))
      ),
      (s) => s.date
    )
    const data = Object.entries(statsByDate).map(([date, values]) => ({
      date,
      ...Object.fromEntries(values.map((s) => [s.dataviewId, { color: s.color, value: s.value }])),
    }))
    return data
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

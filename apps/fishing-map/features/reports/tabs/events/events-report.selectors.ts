import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import type { GetReportEventParams } from 'queries/report-events-stats-api'
import {
  selectReportEventsStats,
  selectReportEventsStatsApiSlice,
  selectReportEventsVessels,
} from 'queries/report-events-stats-api'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'
import {
  getResponsiveVisualizationItemValue,
  type ResponsiveVisualizationAggregatedValue,
  type ResponsiveVisualizationData,
} from '@globalfishingwatch/responsive-visualizations'

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
    if (!eventsDataviews?.length) {
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
        // TODO:CVP2 add other filters using this
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
export const selectEventsTimeseries = createSelector(
  [selectEventsStatsData, selectActiveReportDataviews],
  (stats, dataviews) => {
    if (!stats) {
      return
    }
    const statsByDate = groupBy(
      stats.flatMap((s, i) =>
        (s.timeseries || []).map((t) => ({
          date: t.date,
          dataviewId: dataviews[i].id,
          color: dataviews[i]?.config?.color,
          value: t.value,
        }))
      ),
      (s) => s.date
    )
    const data: ResponsiveVisualizationData<'aggregated'> = Object.entries(statsByDate).map(
      ([date, values]) => ({
        date,
        ...Object.fromEntries(
          values.map((s) => [s.dataviewId, { color: s.color, value: s.value }])
        ),
      })
    )
    return data
  }
)

export const selectTotalStatsEvents = createSelector([selectEventsTimeseries], (timeseries) => {
  if (!timeseries) {
    return
  }
  return timeseries?.reduce((acc, eventsDate) => {
    const { date, ...rest } = eventsDate
    const value = Object.values(rest as ResponsiveVisualizationAggregatedValue).reduce(
      (count, item) => count + getResponsiveVisualizationItemValue(item),
      0
    )
    return acc + value
  }, 0)
})

export const selectEventsVessels = createSelector(
  [selectEventsVesselsData, selectActiveReportDataviews, selectAllDatasets],
  (eventsVessels, activeReportDataviews, allDatasets): ReportVesselWithDatasets[] | undefined => {
    if (!eventsVessels) {
      return
    }

    const statsByVessel = groupBy(
      eventsVessels.flatMap((vessels, i) => {
        const eventsDataset = activeReportDataviews[i]?.datasets?.find(
          (d) => d.type === DatasetTypes.Events
        )
        const vesselDatasetId = eventsDataset?.relatedDatasets?.find(
          (d) => d.type === DatasetTypes.Vessels
        )?.id
        const vesselDataset = allDatasets?.find((d) => d.id === vesselDatasetId)
        const trackDatasetId = vesselDataset?.relatedDatasets?.find(
          (d) => d.type === DatasetTypes.Tracks
        )?.id
        const trackDataset = allDatasets?.find((d) => d.id === trackDatasetId)
        return vessels.map((vessel) => ({
          ...vessel,
          dataviewId: activeReportDataviews[i].id,
          color: activeReportDataviews[i]?.config?.color as string,
          value: vessel.numEvents,
          datasetId: vesselDataset?.id,
          infoDataset: vesselDataset,
          trackDataset: trackDataset,
        }))
      }),
      (s) => s.vesselId
    )

    return Object.values(statsByVessel).map((values) => {
      const sortedValues = values.sort((a, b) => b.value - a.value)
      return {
        ...sortedValues[0],
        values: sortedValues.map((v) => ({
          value: v.value,
          color: v.color,
        })),
      }
    })
  }
)

export const selectTotalEventsVessels = createSelector([selectEventsVessels], (eventsVessels) => {
  return eventsVessels?.length
})

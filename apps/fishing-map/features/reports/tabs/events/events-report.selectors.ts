import { createSelector } from '@reduxjs/toolkit'
import { groupBy } from 'es-toolkit'
import type { GetReportEventParams } from 'queries/report-events-stats-api'
import {
  selectReportEventsPorts,
  selectReportEventsStats,
  selectReportEventsStatsApiSlice,
  selectReportEventsVessels,
} from 'queries/report-events-stats-api'

import type { DataviewDatasetFilter } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import type { DatasetArea } from 'features/areas/areas.slice'
import { selectAreas } from 'features/areas/areas.slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/reports/report-area/area-reports.config'
import {
  type ReportVesselWithDatasets,
  selectReportAreaIds,
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/reports/report-area/area-reports.selectors'
import {
  REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS,
  REPORT_EVENTS_GRAPH_EVOLUTION,
  REPORT_EVENTS_GRAPH_GROUP_BY_PARAMS,
  REPORT_EVENTS_GRAPH_GROUP_BY_RFMO,
  REPORT_EVENTS_RFMO_AREAS,
} from 'features/reports/reports.config'
import {
  selectReportEventsGraph,
  selectReportEventsPortsFilter,
  selectReportEventsPortsPage,
  selectReportEventsPortsResultsPerPage,
} from 'features/reports/reports.config.selectors'
import { getAggregatedDataWithOthers } from 'features/reports/shared/utils/reports.utils'
import { selectReportPortId, selectReportVesselGroupId } from 'routes/routes.selectors'
import { formatInfoField } from 'utils/info'

export const selectEventsGraphDatasetAreaId = createSelector(
  [selectAllDataviews, selectReportEventsGraph],
  (dataviews, reportEventsGraph) => {
    const dataviewId =
      REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS[
        reportEventsGraph as keyof typeof REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS
      ]
    const dataview = dataviews.find((d) => d.slug === dataviewId)
    const layers = dataview?.config?.layers || []

    return layers.length > 1
      ? layers.find((l) => l.id.includes('area'))?.dataset || ''
      : layers[0]?.dataset || ''
  }
)

export const selectEventsGraphDatasetAreas = createSelector(
  [selectAreas, selectEventsGraphDatasetAreaId],
  (areas, datasetAreaId) => {
    return areas[datasetAreaId]?.list?.data as DatasetArea[]
  }
)

export const selectIsReportEventsGraphByArea = createSelector(
  [selectReportEventsGraph],
  (reportEventsGraph) => {
    return Object.keys(REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS).includes(reportEventsGraph as any)
  }
)

export const selectFetchEventsVesselsParams = createSelector(
  [
    selectTimeRange,
    selectReportAreaIds,
    selectReportVesselGroupId,
    selectReportPortId,
    selectActiveReportDataviews,
    selectReportBufferValue,
    selectReportBufferUnit,
    selectReportBufferOperation,
  ],
  (
    { start, end },
    reportAreaIds,
    reportVesselGroupId,
    portId,
    eventsDataviews,
    bufferValue,
    bufferUnit,
    bufferOperation
  ) => {
    if (!eventsDataviews?.length) {
      return
    }

    const datasets = eventsDataviews?.flatMap(
      (dataview) => dataview.datasets?.find((d) => d.type === DatasetTypes.Events)?.id || []
    )
    const filters = eventsDataviews?.flatMap((dataview) => {
      const filter = {
        portId,
        vesselGroupId: reportVesselGroupId,
        ...getDataviewFilters(dataview),
        // TODO:CVP2 add other filters using this
      } as DataviewDatasetFilter

      const durationSchema = dataview.datasets?.find((d) => d.type === DatasetTypes.Events)?.schema
        ?.duration
      const addMinDuration =
        durationSchema !== undefined &&
        filter.duration?.[0] !== undefined &&
        filter.duration[0].toString() !== durationSchema.enum?.[0].toString()
      const addMaxDuration =
        durationSchema !== undefined &&
        filter?.duration?.[1] !== undefined &&
        filter.duration[1].toString() !== durationSchema.enum?.[1].toString()
      if (addMinDuration) {
        filter.minDuration = parseInt(filter.duration[0])
      }
      if (addMaxDuration) {
        filter.maxDuration = parseInt(filter.duration[1])
      }
      return filter
    })

    return {
      start,
      end,
      regionId:
        reportAreaIds.areaId !== ENTIRE_WORLD_REPORT_AREA_ID ? reportAreaIds.areaId : undefined,
      regionDataset: reportAreaIds.datasetId,
      bufferValue,
      bufferUnit,
      bufferOperation,
      filters,
      datasets,
    } as GetReportEventParams
  }
)

export const selectFetchEventsStatsParams = createSelector(
  [selectReportEventsGraph, selectFetchEventsVesselsParams],
  (reportEventsGraph, params) => {
    return {
      ...params,
      includes: ['TIME_SERIES', 'EVENTS_GROUPED', 'TOTAL_COUNT'],
      groupBy: REPORT_EVENTS_GRAPH_GROUP_BY_PARAMS[reportEventsGraph] || 'FLAG',
    } as GetReportEventParams
  }
)

export const selectFetchEventsPortsStatsParams = createSelector(
  [selectFetchEventsVesselsParams],
  (params) => {
    return {
      ...params,
      includes: ['EVENTS_GROUPED'],
      groupBy: 'NEXT_PORT_ID',
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

export const selectEventsPortsData = createSelector(
  [selectReportEventsStatsApiSlice, selectFetchEventsPortsStatsParams],
  (reportEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectReportEventsPorts(params)({ reportEventsStatsApi })?.data
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

export const selectEventsPortsStatsData = createSelector(
  [selectReportEventsStatsApiSlice, selectFetchEventsPortsStatsParams],
  (reportEventsStatsApi, params) => {
    if (!params) {
      return
    }
    return selectReportEventsPorts(params)({ reportEventsStatsApi })?.data
  }
)

export const selectEventsStatsValueKeys = createSelector(
  [selectActiveReportDataviews],
  (dataviews) => {
    return dataviews.map((d) => d.id)
  }
)
export const selectEventsStatsDataGrouped = createSelector(
  [selectReportEventsGraph, selectEventsStatsData, selectActiveReportDataviews],
  (reportEventsGraph, stats, dataviews) => {
    if (!stats) {
      return
    }
    if (reportEventsGraph === REPORT_EVENTS_GRAPH_EVOLUTION) {
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

    const data = stats?.flatMap(({ groups }, i) =>
      groups?.flatMap(({ name, value }) => {
        if (
          reportEventsGraph === REPORT_EVENTS_GRAPH_GROUP_BY_RFMO &&
          !REPORT_EVENTS_RFMO_AREAS.includes(name.toUpperCase())
        ) {
          return []
        }
        const dataview = dataviews[i]
        return {
          label: name,
          dataviewId: dataview?.id,
          color: dataview?.config?.color,
          [dataview.id]: {
            value,
            label: name,
          },
        }
      })
    ) as ResponsiveVisualizationData<'aggregated'>
    const dataviewIds = dataviews.map((d) => d.id)
    return getAggregatedDataWithOthers(data, dataviewIds)
  }
)

export const selectTotalStatsEvents = createSelector([selectEventsStatsData], (statsData = []) => {
  return statsData?.reduce((acc, eventsData) => {
    return acc + eventsData.numEvents
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

export const selectReportEventsPortsData = createSelector(
  [selectEventsPortsStatsData],
  (portsData) => {
    return portsData?.[0]?.groups.flatMap((p) => {
      if (!p.name) return []
      return {
        id: p.name,
        name: formatInfoField(p.label || p.name, 'port') as string,
        country: formatInfoField(p.flag, 'flag') as string,
        value: p.value as number,
      }
    })
  }
)

export const selectReportEventsPortsFiltered = createSelector(
  [selectReportEventsPortsData, selectReportEventsPortsFilter],
  (ports, filter) => {
    if (!filter) return ports
    return ports?.filter(
      (p) =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.country.toLowerCase().includes(filter.toLowerCase())
    )
  }
)

export const selectReportEventsPortsPaginated = createSelector(
  [
    selectReportEventsPortsFiltered,
    selectReportEventsPortsPage,
    selectReportEventsPortsResultsPerPage,
  ],
  (ports, page, resultsPerPage) => {
    if (!ports?.length) return []
    return ports.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectReportEventsPortsPagination = createSelector(
  [
    selectReportEventsPortsPaginated,
    selectReportEventsPortsData,
    selectReportEventsPortsFiltered,
    selectReportEventsPortsPage,
    selectReportEventsPortsResultsPerPage,
  ],
  (ports, allPorts, allPortsFiltered, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage:
        typeof resultsPerPage === 'number' ? resultsPerPage : parseInt(resultsPerPage),
      resultsNumber: ports?.length,
      totalFiltered: allPortsFiltered?.length || 0,
      total: allPorts?.length || 0,
    }
  }
)

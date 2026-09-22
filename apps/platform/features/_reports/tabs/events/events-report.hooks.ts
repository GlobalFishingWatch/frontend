import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { color } from 'color-blend'
import { uniqBy } from 'es-toolkit'
import { stringify } from 'qs'
import {
  EVENTS_TIME_FILTER_MODE,
  getEventsDataviewFilters,
  parseEventsFilters,
} from 'queries/map/report-events-stats-api'

import { API_VERSION, GFWAPI } from '@globalfishingwatch/api-client'
import { type ApiEvent, type APIPagination, DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/_reports/report-area/area-reports.config'
import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/_reports/report-area/area-reports.selectors'
import {
  REPORT_EVENTS_GRAPH_GROUP_BY_EEZ,
  REPORT_EVENTS_GRAPH_GROUP_BY_FAO,
  REPORT_EVENTS_GRAPH_GROUP_BY_FLAG,
  REPORT_EVENTS_GRAPH_GROUP_BY_RFMO,
} from 'features/_reports/reports.config'
import { selectReportEventsGraph } from 'features/_reports/reports.config.selectors'
import {
  selectReportAreaId,
  selectReportCategory,
  selectReportDatasetId,
  selectReportSubCategory,
} from 'features/_reports/reports.selectors'
import { selectEventsGraphDatasetAreas } from 'features/_reports/tabs/events/events-report.selectors'
import { selectReportPortId, selectReportVesselGroupId } from 'router/routes.selectors'
import { formatInfoField } from 'utils/info'

export function useGetEventReportGraphLabel() {
  const { t } = useTranslation()
  const reportEventsGraph = useSelector(selectReportEventsGraph)
  const eventsGraphDatasetAreas = useSelector(selectEventsGraphDatasetAreas)
  return useCallback(
    (areaId: string) => {
      switch (reportEventsGraph) {
        case REPORT_EVENTS_GRAPH_GROUP_BY_FLAG:
          return areaId
            ? (formatInfoField(areaId, 'flag') as string)
            : t((t) => t.common.unknownProperty)
        case REPORT_EVENTS_GRAPH_GROUP_BY_RFMO:
        case REPORT_EVENTS_GRAPH_GROUP_BY_FAO:
          return eventsGraphDatasetAreas?.find(
            (f) => areaId && f.id?.toString().toUpperCase() === areaId?.toString()?.toUpperCase()
          )?.label
        case REPORT_EVENTS_GRAPH_GROUP_BY_EEZ:
          return eventsGraphDatasetAreas
            ?.find((f) => f.id?.toString().toUpperCase() === areaId?.toString()?.toUpperCase())
            ?.label.replace('Exclusive Economic Zone', 'EEZ')
            .trim()
        default:
          return areaId
      }
    },
    [eventsGraphDatasetAreas, reportEventsGraph, t]
  )
}

export type FetchEventReportGraphEventsParams = {
  dataviews: UrlDataviewInstance[]
  start: string
  end: string
  includes?: string[]
}
export function useFetchEventReportGraphEvents() {
  const reportAreaDataset = useSelector(selectReportDatasetId)
  const reportAreaId = useSelector(selectReportAreaId)
  const reportPortId = useSelector(selectReportPortId)
  const reportVesselGroupId = useSelector(selectReportVesselGroupId)
  const reportBufferValue = useSelector(selectReportBufferValue)
  const reportBufferUnit = useSelector(selectReportBufferUnit)
  const reportBufferOperation = useSelector(selectReportBufferOperation)

  const getIndividualData = useCallback(
    async ({ dataviews, start, end, includes }: FetchEventReportGraphEventsParams) => {
      // Every dataview queries its own events dataset, using dataviews[0] for all of them
      // returned the wrong events whenever the report had more than one events dataview
      const dataviewsWithDataset = (dataviews || []).flatMap((dataview) => {
        const datasetId = dataview.datasets?.find((d) => d.type === DatasetTypes.Events)?.id
        return datasetId ? { dataview, datasetId } : []
      })
      if (!dataviewsWithDataset.length) {
        return []
      }

      const promises = dataviewsWithDataset.map(({ dataview, datasetId }) => {
        // Has to resolve to the very same filters the stats and by-vessel endpoints get,
        // otherwise the graph points and the vessels table disagree
        const filters = {
          portId: reportPortId,
          vesselGroupId: reportVesselGroupId,
          ...getEventsDataviewFilters(dataview),
        }
        const params = {
          'start-date': start,
          'end-date': end,
          'time-filter-mode': EVENTS_TIME_FILTER_MODE,
          datasets: [datasetId],
          ...(includes?.length && { includes }),
          ...parseEventsFilters(filters, dataview.config?.filterOperators),
          ...(reportAreaId &&
            reportAreaId !== ENTIRE_WORLD_REPORT_AREA_ID && {
              'region-ids': reportAreaId.split(','),
              ...(reportAreaDataset && { 'region-datasets': reportAreaDataset.split(',') }),
              ...(reportBufferValue && { 'buffer-value': reportBufferValue }),
              ...(reportBufferUnit && { 'buffer-unit': reportBufferUnit.toUpperCase() }),
              ...(reportBufferOperation && {
                'buffer-operation': reportBufferOperation.toUpperCase(),
              }),
            }),
          limit: 1000,
          offset: 0,
        }
        return GFWAPI.fetch<APIPagination<ApiEvent>>(`/${API_VERSION}/events?${stringify(params)}`)
      })
      const settledPromises = await Promise.allSettled(promises)
      const data = settledPromises.flatMap((d, index) => {
        const { dataview, datasetId } = dataviewsWithDataset[index]
        return d.status === 'fulfilled' && !(d.value as any).error
          ? d.value.entries.flatMap((event) => {
              const eventColor = dataview.config?.color || color
              return { ...event, color: eventColor, datasetId }
            })
          : []
      })
      return uniqBy(data, (event) => event.id.split('.')[0])
    },
    [
      reportAreaDataset,
      reportAreaId,
      reportBufferValue,
      reportBufferUnit,
      reportBufferOperation,
      reportPortId,
      reportVesselGroupId,
    ]
  )
  return getIndividualData
}

export function useReportHash() {
  const { start, end } = useSelector(selectTimeRange)
  const category = useSelector(selectReportCategory)
  const subcategory = useSelector(selectReportSubCategory)
  const [reportHash, setReportHash] = useState('idle')

  const getReportHash = useCallback(() => {
    return `${category || ''}-${subcategory || ''}-(${start}-${end})`
  }, [category, end, start, subcategory])

  const updateReportHash = useCallback(() => {
    setReportHash(getReportHash())
  }, [getReportHash])

  const reportOutdated = reportHash !== getReportHash()

  return { updateReportHash, reportOutdated }
}

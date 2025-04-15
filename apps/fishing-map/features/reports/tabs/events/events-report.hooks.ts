import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { color } from 'color-blend'
import { stringify } from 'qs'
import { getEventsStatsQuery } from 'queries/report-events-stats-api'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { type ApiEvent, type APIPagination, DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/reports/report-area/area-reports.selectors'
import {
  REPORT_EVENTS_GRAPH_GROUP_BY_EEZ,
  REPORT_EVENTS_GRAPH_GROUP_BY_FAO,
  REPORT_EVENTS_GRAPH_GROUP_BY_FLAG,
  REPORT_EVENTS_GRAPH_GROUP_BY_RFMO,
} from 'features/reports/reports.config'
import { selectReportEventsGraph } from 'features/reports/reports.config.selectors'
import { selectReportAreaId, selectReportDatasetId } from 'features/reports/reports.selectors'
import { selectEventsGraphDatasetAreas } from 'features/reports/tabs/events/events-report.selectors'
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
            : t('common.unknownProperty', 'Unknown')
        case REPORT_EVENTS_GRAPH_GROUP_BY_RFMO:
        case REPORT_EVENTS_GRAPH_GROUP_BY_FAO:
        case REPORT_EVENTS_GRAPH_GROUP_BY_EEZ:
          return eventsGraphDatasetAreas?.find(
            (f) => f.id?.toString().toUpperCase() === areaId?.toUpperCase()
          )?.label
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
  const reportBufferValue = useSelector(selectReportBufferValue)
  const reportBufferUnit = useSelector(selectReportBufferUnit)
  const reportBufferOperation = useSelector(selectReportBufferOperation)
  const getIndividualData = useCallback(
    async ({ dataviews, start, end, includes }: FetchEventReportGraphEventsParams) => {
      const datasetId = dataviews?.[0]?.datasets?.find((d) => d.type === DatasetTypes.Events)?.id
      if (!dataviews?.length || !datasetId) {
        return []
      }

      const promises = dataviews.map((dataview) => {
        const filters = getDataviewFilters(dataview)
        const params = {
          ...getEventsStatsQuery({
            start,
            end,
            filters,
            dataset: datasetId,
            regionDataset: reportAreaDataset,
            regionId: reportAreaId,
            bufferValue: reportBufferValue,
            bufferUnit: reportBufferUnit,
            bufferOperation: reportBufferOperation,
          }),
          ...(includes?.length && { includes }),
          limit: 1000,
          offset: 0,
        }
        return GFWAPI.fetch<APIPagination<ApiEvent>>(`/v3/events?${stringify(params)}`)
      })
      const settledPromises = await Promise.allSettled(promises)
      const data = settledPromises.flatMap((d, index) => {
        return d.status === 'fulfilled' && !(d.value as any).error
          ? d.value.entries.flatMap((event) => {
              const eventColor = dataviews[index]?.config?.color || color
              return { ...event, color: eventColor }
            })
          : []
      })
      return data
    },
    [reportAreaDataset, reportAreaId, reportBufferValue, reportBufferUnit, reportBufferOperation]
  )
  return getIndividualData
}

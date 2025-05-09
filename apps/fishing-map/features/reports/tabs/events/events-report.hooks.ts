import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { color } from 'color-blend'
import { uniqBy } from 'es-toolkit'
import { stringify } from 'qs'
import { parseEventsFilters } from 'queries/report-events-stats-api'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { type ApiEvent, type APIPagination, DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/reports/report-area/area-reports.config'
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
import {
  selectReportAreaId,
  selectReportCategory,
  selectReportDatasetId,
  selectReportSubCategory,
} from 'features/reports/reports.selectors'
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
          'start-date': start,
          'end-date': end,
          datasets: [datasetId],
          ...(includes?.length && { includes }),
          ...parseEventsFilters(filters),
          ...(reportAreaId &&
            reportAreaId !== ENTIRE_WORLD_REPORT_AREA_ID && {
              'region-datasets': [reportAreaDataset],
              'region-ids': [reportAreaId],
              'buffer-value': reportBufferValue,
              'buffer-unit': reportBufferUnit.toUpperCase(),
              'buffer-operation': reportBufferOperation.toUpperCase(),
            }),
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
      return uniqBy(data, (event) => event.id.split('.')[0])
    },
    [reportAreaDataset, reportAreaId, reportBufferValue, reportBufferUnit, reportBufferOperation]
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

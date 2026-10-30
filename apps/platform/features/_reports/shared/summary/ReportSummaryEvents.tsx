import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { lowerCase } from 'es-toolkit'
import { DateTime } from 'luxon'

import type { EventType } from '@globalfishingwatch/api-types'
import { DatasetTypes, EventTypes } from '@globalfishingwatch/api-types'

import { selectActiveReportDataviews } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import { selectIsGlobalReport } from 'features/_reports/report-area/area-reports.selectors'
import ReportSummaryPlaceholder from 'features/_reports/shared/placeholders/ReportSummaryPlaceholder'
import { selectReportVesselsFlags } from 'features/_reports/shared/vessels/report-vessels.selectors'
import {
  selectEventsStatsDataGrouped,
  selectTotalEventsVessels,
  selectTotalStatsEvents,
} from 'features/_reports/tabs/events/events-report.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import { getDatasetSourceTranslated } from 'features/i18n/utils.datasets'
import { selectIsPortReportLocation } from 'router/routes.selectors'
import { htmlSafeParse } from 'utils/html-parser'

/** `areaName` names the area instead of "in the area", for when the report title is not around */
export default function ReportSummaryEvents({ areaName }: { areaName?: string } = {}) {
  const { t } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const totalStatsEvents = useSelector(selectTotalStatsEvents)
  const totalEventsVessels = useSelector(selectTotalEventsVessels)
  const reportVesselsFlags = useSelector(selectReportVesselsFlags)
  const isGlobalReport = useSelector(selectIsGlobalReport)
  const eventsStatsDataGrouped = useSelector(selectEventsStatsDataGrouped)

  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  const eventDataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  const eventType = (eventDataset?.subcategory ??
    (isPortReportLocation ? EventTypes.Port : undefined)) as EventType

  const summary = useMemo(() => {
    const startDate = formatI18nDate(timerange?.start, {
      format: DateTime.DATE_MED,
    })
    const endDate = formatI18nDate(timerange?.end, {
      format: DateTime.DATE_MED,
    })
    const activityQuantity = formatI18nNumber(totalStatsEvents || 0)

    const activityUnit = eventType
      ? String(
          t((t) => (t.event as any)[eventType.toLowerCase()], {
            defaultValue: lowerCase(eventType || ''),
            count: totalStatsEvents,
            source: getDatasetSourceTranslated({ id: eventDataset?.source || '' }),
          } as any)
        ).toLowerCase()
      : ''

    const area = isPortReportLocation
      ? t((t) => t.portsReport.toThisPort, { defaultValue: 'to this port' })
      : !isGlobalReport
        ? areaName
          ? t((t) => t.analysis.inNamedArea, { area: areaName })
          : t((t) => t.analysis.inTheArea, { defaultValue: 'in the area' })
        : t((t) => t.analysis.globally)

    if (!totalEventsVessels) {
      if (eventsStatsDataGrouped === undefined) {
        return ''
      }
      return t((t) => t.analysis.summaryEventsNoVessels, {
        activityQuantity: activityQuantity as string,
        activityUnit,
        area,
        start: startDate,
        end: endDate,
      })
    }
    const vessels = formatI18nNumber(totalEventsVessels || 0)
    if (isPortReportLocation) {
      return t((t) => t.portsReport.summaryEvents, {
        vessels: vessels as string,
        flags: String(reportVesselsFlags?.size || 0),
        activityQuantity: activityQuantity as string,
        start: startDate,
        end: endDate,
      })
    }
    return t((t) => t.analysis.summaryEvents, {
      vessels: vessels as string,
      flags: String(reportVesselsFlags?.size || 0),
      activityQuantity: activityQuantity as string,
      activityUnit,
      start: startDate,
      end: endDate,
      area,
    })
  }, [
    areaName,
    eventType,
    eventsStatsDataGrouped,
    isPortReportLocation,
    isGlobalReport,
    reportVesselsFlags?.size,
    t,
    eventDataset?.source,
    timerange?.end,
    timerange?.start,
    totalEventsVessels,
    totalStatsEvents,
  ])

  return summary ? htmlSafeParse(summary) : <ReportSummaryPlaceholder />
}

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { lowerCase } from 'es-toolkit'
import htmlParser from 'html-react-parser'
import { DateTime } from 'luxon'

import type { EventType } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectReportAreaId } from 'features/reports/reports.selectors'
import ReportSummaryPlaceholder from 'features/reports/shared/placeholders/ReportSummaryPlaceholder'
import { selectReportVesselsFlags } from 'features/reports/shared/vessels/report-vessels.selectors'
import {
  selectEventsStatsDataGrouped,
  selectTotalEventsVessels,
  selectTotalStatsEvents,
} from 'features/reports/tabs/events/events-report.selectors'
import { selectIsPortReportLocation } from 'routes/routes.selectors'

export default function ReportSummaryEvents() {
  const { t } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const totalStatsEvents = useSelector(selectTotalStatsEvents)
  const totalEventsVessels = useSelector(selectTotalEventsVessels)
  const reportVesselsFlags = useSelector(selectReportVesselsFlags)
  const reportAreaId = useSelector(selectReportAreaId)
  const eventsStatsDataGrouped = useSelector(selectEventsStatsDataGrouped)

  const eventsDataview = useSelector(selectActiveReportDataviews)?.[0]
  const eventDataset = eventsDataview?.datasets?.find((d) => d.type === DatasetTypes.Events)
  const eventType = eventDataset?.subcategory as EventType

  const summary = useMemo(() => {
    const startDate = formatI18nDate(timerange?.start, {
      format: DateTime.DATE_MED,
    })
    const endDate = formatI18nDate(timerange?.end, {
      format: DateTime.DATE_MED,
    })
    const activityQuantity = formatI18nNumber(totalStatsEvents || 0)

    const activityUnit = eventType
      ? t(`event.${eventType.toLowerCase()}`, {
          defaultValue: lowerCase(eventType),
          count: totalStatsEvents,
        }).toLowerCase()
      : ''

    if (!totalEventsVessels) {
      if (eventsStatsDataGrouped === undefined) {
        return ''
      }
      return t('analysis.summaryEventsNoVessels', {
        defaultValue:
          '<strong>{{activityQuantity}} {{activityUnit}}</strong> {{area}} between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
        activityQuantity,
        activityUnit,
        area: reportAreaId ? '' : t('analysis.globally', 'globally'),
        start: startDate,
        end: endDate,
      })
    }
    const vessels = formatI18nNumber(totalEventsVessels || 0)
    if (isPortReportLocation) {
      return t('portsReport.summaryEvents', {
        defaultValue:
          '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> entered this port <strong>{{activityQuantity}}</strong> times between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
        vessels,
        flags: reportVesselsFlags?.size || 0,
        activityQuantity,
        start: startDate,
        end: endDate,
      })
    }
    return t('analysis.summaryEvents', {
      defaultValue:
        '<strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> had <strong>{{activityQuantity}} {{activityUnit}}</strong> {{area}} between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
      vessels,
      flags: reportVesselsFlags?.size || 0,
      activityQuantity,
      activityUnit,
      start: startDate,
      end: endDate,
      area: reportAreaId ? '' : t('analysis.globally', 'globally'),
    })
  }, [
    eventType,
    eventsStatsDataGrouped,
    isPortReportLocation,
    reportAreaId,
    reportVesselsFlags?.size,
    t,
    timerange?.end,
    timerange?.start,
    totalEventsVessels,
    totalStatsEvents,
  ])

  return summary ? htmlParser(summary) : <ReportSummaryPlaceholder />
}

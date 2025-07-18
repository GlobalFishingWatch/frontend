import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { sum } from 'es-toolkit'
import htmlParser from 'html-react-parser'

import type { Locale } from '@globalfishingwatch/api-types'

import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectReportDataviewsWithPermissions } from 'features/reports/report-area/area-reports.selectors'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import ReportSummaryPlaceholder from 'features/reports/shared/placeholders/ReportSummaryPlaceholder'
import { getHasAllSourcesInCommon } from 'features/reports/shared/summary/report-summary.utils'
import {
  getReportRequestHash,
  selectReportRequestHash,
} from 'features/reports/tabs/activity/reports-activity.slice'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'
import { useTimeCompareTimeDescription } from 'features/reports/tabs/activity/reports-activity-timecomparison.hooks'
import type { ReportGraphProps } from 'features/reports/tabs/activity/reports-activity-timeseries.hooks'
import {
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/reports/tabs/activity/reports-activity-timeseries.hooks'
import { formatEvolutionData } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import {
  selectReportVesselsHours,
  selectReportVesselsNumber,
} from 'features/reports/tabs/activity/vessels/report-activity-vessels.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { AsyncReducerStatus } from 'utils/async-slice'
import { listAsSentence } from 'utils/shared'

export const PROPERTIES_EXCLUDED = ['flag', 'geartype']

export default function ReportSummaryActivity({
  activityUnit,
  reportStatus = AsyncReducerStatus.Finished,
}: {
  activityUnit: ReportActivityUnit
  reportStatus?: AsyncReducerStatus
}) {
  const { t, i18n } = useTranslation()
  const timerange = useTimerangeConnect()
  const reportCategory = useSelector(selectReportCategory)
  const reportDataviews = useSelector(selectReportDataviewsWithPermissions)
  const reportVessels = useSelector(selectReportVesselsNumber)
  const timeseriesLoading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const reportHours = useSelector(selectReportVesselsHours) as number
  const dataviews = useSelector(selectActiveReportDataviews)
  const reportRequestHash = useSelector(selectReportRequestHash)
  const reportOutdated =
    reportRequestHash !==
    getReportRequestHash({
      datasets: reportDataviews.flatMap(({ datasets }) => datasets?.map((d) => d.id) || []),
      filters: (reportDataviews as any[]).map((d) => d.filter),
      dateRange: timerange,
    })
  const timeCompareTimeDescription = useTimeCompareTimeDescription()

  const hasAllSourcesInCommon = getHasAllSourcesInCommon(dataviews)

  const activitySummary = useMemo(() => {
    if (!dataviews.length || !layersTimeseriesFiltered?.length) return

    if (timeCompareTimeDescription) {
      return timeCompareTimeDescription
    }
    const datasetTitles = dataviews?.map((dataview) =>
      getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
    )
    const sameTitleDataviews = datasetTitles.every((d) => d === datasetTitles?.[0])
    const datasetTitle = sameTitleDataviews
      ? datasetTitles?.[0]
      : reportCategory === ReportCategory.Activity
        ? `${t('common.of')} <strong>${t('common.activity').toLowerCase()}</strong>`
        : undefined

    if (
      reportHours &&
      reportStatus === AsyncReducerStatus.Finished &&
      reportCategory !== ReportCategory.Detections &&
      !reportOutdated
    ) {
      return t('analysis.summary', {
        vessels: formatI18nNumber(reportVessels || 0, {
          locale: i18n.language as Locale,
        }),
        activityQuantity: formatI18nNumber(Math.floor(reportHours), {
          locale: i18n.language as Locale,
        }),
        activityUnit: t(`common.${activityUnit}`, {
          defaultValue: 'hours',
          count: Math.floor(reportHours),
        }),
        activityType: datasetTitle,
        start: formatI18nDate(timerange?.start),
        end: formatI18nDate(timerange?.end),
        sources: hasAllSourcesInCommon
          ? ` (${listAsSentence(
              getSourcesSelectedInDataview(dataviews[0]).map((source) => source.label)
            )})`
          : '',
      })
    }
    if (
      (!timeseriesLoading && layersTimeseriesFiltered !== undefined) ||
      (reportCategory === ReportCategory.Detections &&
        reportStatus === AsyncReducerStatus.Finished &&
        reportHours)
    ) {
      const formattedTimeseries = formatEvolutionData(
        (layersTimeseriesFiltered?.[0] || {}) as ReportGraphProps
      )
      const timeseriesHours = sum(formattedTimeseries?.map((t) => sum(t.avg)) || [])
      const timeseriesMaxHours = sum(
        formattedTimeseries?.map((t) => sum(t.range.map((r) => r[1]))) || []
      )
      const timeseriesImprecision = ((timeseriesMaxHours - timeseriesHours) / timeseriesHours) * 100
      let activityQuantity =
        !timeseriesLoading && layersTimeseriesFiltered?.[0]
          ? `<span>${formatI18nNumber(timeseriesHours.toFixed(), {
              locale: i18n.language as Locale,
            })}</span>`
          : 0
      if (
        reportCategory === ReportCategory.Detections &&
        reportStatus === AsyncReducerStatus.Finished &&
        reportHours
      ) {
        activityQuantity = formatI18nNumber(Math.floor(reportHours), {
          locale: i18n.language as Locale,
        }) as string
      }
      const activityUnitLabel =
        reportCategory === ReportCategory.Activity
          ? `<strong>${t(`common.${activityUnit}`, {
              defaultValue: 'hours',
              count: Math.floor(reportHours),
            })}</strong> ${
              Math.round(timeseriesImprecision)
                ? `<a href="https://globalfishingwatch.org/faqs/calculating-fishing-effort-estimates-in-dynamic-analysis-reports/" target="_blank"
                rel="noopener noreferrer" style="cursor: help" title="${t('common.learnMore')}">± ${Math.round(timeseriesImprecision)}%</a> `
                : ''
            }${t('common.of')}`
          : ''

      return t('analysis.summaryNoVessels', {
        activityQuantity,
        activityUnit: activityUnitLabel,
        activityType: datasetTitle,
        start: formatI18nDate(timerange?.start),
        end: formatI18nDate(timerange?.end),
      })
    }
  }, [
    dataviews,
    timeCompareTimeDescription,
    reportCategory,
    t,
    reportHours,
    reportStatus,
    reportOutdated,
    timeseriesLoading,
    layersTimeseriesFiltered,
    reportVessels,
    i18n.language,
    activityUnit,
    timerange?.start,
    timerange?.end,
    hasAllSourcesInCommon,
  ])

  return activitySummary ? htmlParser(activitySummary) : <ReportSummaryPlaceholder />
}

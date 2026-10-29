import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { sum } from 'es-toolkit'

import type { Locale } from '@globalfishingwatch/api-types'

import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/_map/dataviews/selectors/dataviews.selectors'
import { useTimerangeConnect } from 'features/_map/timebar/timerange.hooks'
import { getSourcesSelectedInDataview } from 'features/_map/workspace/activity/activity.utils'
import {
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/_reports/report-area/area-reports.buffer.selectors'
import {
  selectIsGlobalReport,
  selectReportDataviewsWithPermissions,
} from 'features/_reports/report-area/area-reports.selectors'
import { selectReportAreaId } from 'features/_reports/reports.current.selectors'
import { selectReportCategory } from 'features/_reports/reports.selectors'
import { ReportCategory } from 'features/_reports/reports.types'
import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'
import {
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/_reports/reports-timeseries.hooks'
import { getReportSourcesWithVessels } from 'features/_reports/shared/summary/report-summary.utils'
import { selectReportVesselsFiltered } from 'features/_reports/shared/vessels/report-vessels.selectors'
import {
  getReportRequestHash,
  selectReportRequestHash,
} from 'features/_reports/tabs/activity/reports-activity.slice'
import { useTimeCompareTimeDescription } from 'features/_reports/tabs/activity/reports-activity-timecomparison.hooks'
import { formatEvolutionData } from 'features/_reports/tabs/activity/reports-activity-timeseries.utils'
import {
  selectReportActivityDatasetIdsWithVessels,
  selectReportVesselsHours,
  selectReportVesselsNumber,
} from 'features/_reports/tabs/activity/vessels/report-activity-vessels.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import { AsyncReducerStatus } from 'utils/async-slice'

const HOUR_ROUNDING_THRESHOLD = 5

type ReportActivitySummaryBase = {
  /** Only when every layer shares it, otherwise each summary picks its own wording */
  datasetTitle?: string
  isGlobalReport: boolean
  isActivity: boolean
  /** Floored hours or detections, for plurals */
  count: number
  start: string
  end: string
}

export type ReportActivitySummaryData =
  | { type: 'timeCompare'; description: string }
  | (ReportActivitySummaryBase & {
      type: 'vessels'
      vessels: string
      quantity: string
      /** Labels of the sources with vessels in the report */
      sources: string[]
    })
  | (ReportActivitySummaryBase & {
      type: 'timeseries'
      quantity: string
      /** Rounded ± % of the timeseries estimate, 0 when exact */
      imprecision: number
    })

export function useReportActivitySummaryData({
  reportStatus = AsyncReducerStatus.Finished,
  vesselsFiltered = false,
}: {
  reportStatus?: AsyncReducerStatus
  vesselsFiltered?: boolean
} = {}): ReportActivitySummaryData | undefined {
  const { i18n } = useTranslation()
  const timerange = useTimerangeConnect()
  const reportCategory = useSelector(selectReportCategory)
  const reportDataviews = useSelector(selectReportDataviewsWithPermissions)
  const allReportVessels = useSelector(selectReportVesselsNumber)
  const allReportHours = useSelector(selectReportVesselsHours) as number
  const filteredVessels = useSelector(selectReportVesselsFiltered)
  const datasetIdsWithVessels = useSelector(selectReportActivityDatasetIdsWithVessels)
  const timeseriesLoading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const dataviews = useSelector(selectActiveReportDataviews)
  const reportRequestHash = useSelector(selectReportRequestHash)
  const areaId = useSelector(selectReportAreaId)
  const reportBufferUnit = useSelector(selectReportBufferUnit)
  const reportBufferValue = useSelector(selectReportBufferValue)
  const reportBufferOperation = useSelector(selectReportBufferOperation)
  const isGlobalReport = useSelector(selectIsGlobalReport)
  const timeCompareTimeDescription = useTimeCompareTimeDescription()
  const reportVessels = vesselsFiltered ? filteredVessels?.length : allReportVessels
  const reportHours = vesselsFiltered
    ? sum(filteredVessels?.map((vessel) => vessel.value || 0) || [])
    : allReportHours
  const reportOutdated =
    reportRequestHash !==
    getReportRequestHash({
      datasets: reportDataviews.flatMap(({ datasets }) => datasets?.map((d) => d.id) || []),
      filters: (reportDataviews as any[]).map((d) => d.filter),
      dateRange: timerange,
      areaId,
      reportBufferUnit,
      reportBufferValue,
      reportBufferOperation,
    })

  return useMemo(() => {
    if (!dataviews.length || !layersTimeseriesFiltered?.length) return

    if (timeCompareTimeDescription) {
      return { type: 'timeCompare', description: timeCompareTimeDescription }
    }
    const locale = i18n.language as Locale
    const datasetTitles = dataviews.map((dataview) =>
      getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
    )
    const base: ReportActivitySummaryBase = {
      datasetTitle: datasetTitles.every((d) => d === datasetTitles[0])
        ? datasetTitles[0]
        : undefined,
      isGlobalReport,
      isActivity: reportCategory === ReportCategory.Activity,
      count: Math.floor(reportHours || 0),
      start: formatI18nDate(timerange?.start),
      end: formatI18nDate(timerange?.end),
    }
    const isDetectionsFinished =
      reportCategory === ReportCategory.Detections &&
      reportStatus === AsyncReducerStatus.Finished &&
      !!reportHours

    if (
      reportHours &&
      reportStatus === AsyncReducerStatus.Finished &&
      reportCategory !== ReportCategory.Detections &&
      !reportOutdated
    ) {
      return {
        ...base,
        type: 'vessels',
        vessels: formatI18nNumber(reportVessels || 0, { locale }).toString(),
        quantity: formatI18nNumber(Math.floor(reportHours), { locale }).toString(),
        sources: getReportSourcesWithVessels(
          dataviews.flatMap((dataview) => getSourcesSelectedInDataview(dataview)),
          datasetIdsWithVessels
        ),
      }
    }
    if ((!timeseriesLoading && layersTimeseriesFiltered !== undefined) || isDetectionsFinished) {
      const firstTimeseries = (layersTimeseriesFiltered?.[0] || {}) as ReportGraphProps
      const formattedTimeseries = formatEvolutionData(firstTimeseries, {
        start: timerange?.start,
        end: timerange?.end,
        timeseriesInterval: firstTimeseries?.interval,
      })
      const timeseriesHours = sum(formattedTimeseries?.map((t) => sum(t.avg || [0])) || [])
      const timeseriesMaxHours = sum(
        formattedTimeseries?.map((t) => sum(t.range?.map((r) => r?.[1] || 0) || [])) || []
      )
      const quantity = isDetectionsFinished
        ? formatI18nNumber(Math.floor(reportHours), { locale })
        : !timeseriesLoading && layersTimeseriesFiltered?.[0]
          ? formatI18nNumber(
              timeseriesHours > HOUR_ROUNDING_THRESHOLD
                ? timeseriesHours.toFixed()
                : timeseriesHours,
              { locale }
            )
          : 0
      return {
        ...base,
        type: 'timeseries',
        quantity: String(quantity),
        imprecision: Math.round(((timeseriesMaxHours - timeseriesHours) / timeseriesHours) * 100),
      }
    }
  }, [
    dataviews,
    layersTimeseriesFiltered,
    timeCompareTimeDescription,
    i18n.language,
    isGlobalReport,
    reportCategory,
    reportHours,
    timerange?.start,
    timerange?.end,
    reportStatus,
    reportOutdated,
    reportVessels,
    datasetIdsWithVessels,
    timeseriesLoading,
  ])
}

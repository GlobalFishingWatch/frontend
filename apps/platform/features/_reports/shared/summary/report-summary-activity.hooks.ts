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
  selectReportActivityFlatten,
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
import type { ReportHoursByLayer } from 'features/_reports/shared/summary/report-summary.utils'
import { getReportSourcesWithVessels } from 'features/_reports/shared/summary/report-summary.utils'
import { selectReportVesselsFiltered } from 'features/_reports/shared/vessels/report-vessels.selectors'
import {
  getReportRequestHash,
  selectReportRequestHash,
  selectReportVesselsStatus,
} from 'features/_reports/tabs/activity/reports-activity.slice'
import { useTimeCompareTimeDescription } from 'features/_reports/tabs/activity/reports-activity-timecomparison.hooks'
import { formatEvolutionData } from 'features/_reports/tabs/activity/reports-activity-timeseries.utils'
import {
  selectReportActivityDatasetIdsWithVessels,
  selectReportVesselsHours,
  selectReportVesselsNumber,
} from 'features/_reports/tabs/activity/vessels/report-activity-vessels.selectors'
import type { TilesHoursMode } from 'features/_reports/tabs/activity/vessels/report-activity-vessels.utils'
import {
  getHoursByLayer,
  getReportHoursMode,
  getTilesHoursMode,
} from 'features/_reports/tabs/activity/vessels/report-activity-vessels.utils'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import { AsyncReducerStatus } from 'utils/async-slice'

const HOUR_ROUNDING_THRESHOLD = 5

const getImprecision = (hours: number, maxHours: number) =>
  hours ? Math.round(((maxHours - hours) / hours) * 100) : 0

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

type ReportActivitySummaryQuantity = {
  quantity: string
  /**
   * Only when the layers' total is not precise:
   * vessels by getReportHoursMode,
   * timeseries by getTilesHoursMode
   */
  byLayer?: ReportHoursByLayer[]
}

export type ReportActivitySummaryData =
  | { type: 'timeCompare'; description: string }
  | (ReportActivitySummaryBase &
      ReportActivitySummaryQuantity & {
        type: 'vessels'
        vessels: string
        /** Labels of the sources with vessels in the report */
        sources: string[]
      })
  | (ReportActivitySummaryBase &
      ReportActivitySummaryQuantity & {
        type: 'timeseries'
        /** Rounded ± % of the timeseries estimate, 0 when exact */
        imprecision: number
      })

export function useReportActivitySummaryData({
  vesselsFiltered = false,
}: {
  vesselsFiltered?: boolean
} = {}): ReportActivitySummaryData | undefined {
  const { i18n } = useTranslation()
  const reportStatus = useSelector(selectReportVesselsStatus)
  const timerange = useTimerangeConnect()
  const reportCategory = useSelector(selectReportCategory)
  const reportDataviews = useSelector(selectReportDataviewsWithPermissions)
  const allReportVessels = useSelector(selectReportVesselsNumber)
  const allReportHours = useSelector(selectReportVesselsHours) as number
  const activityRows = useSelector(selectReportActivityFlatten)
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
  // A filter matching no vessels is a real 0, not missing data
  const hasReportHours = !!reportHours || (vesselsFiltered && !!filteredVessels)
  const vesselsByLayer = useMemo(() => {
    if (!activityRows?.length) {
      return
    }
    const shownIds = vesselsFiltered && new Set(filteredVessels?.map((vessel) => vessel.id))
    const rows = shownIds ? activityRows.filter((row) => shownIds.has(row.vesselId)) : activityRows
    return getReportHoursMode(rows, reportDataviews) === 'byLayer'
      ? getHoursByLayer(rows, reportDataviews)
      : undefined
  }, [activityRows, filteredVessels, reportDataviews, vesselsFiltered])
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
      hasReportHours

    const formatCount = (value: number) =>
      formatI18nNumber(Math.floor(value), { locale }).toString()
    const vesselsQuantity: ReportActivitySummaryQuantity = {
      quantity: formatCount(
        vesselsByLayer ? sum(vesselsByLayer.map((layer) => layer.hours)) : reportHours
      ),
      byLayer: vesselsByLayer?.map(({ color, hours }) => ({ color, hours: formatCount(hours) })),
    }

    if (
      hasReportHours &&
      reportStatus === AsyncReducerStatus.Finished &&
      reportCategory !== ReportCategory.Detections &&
      !reportOutdated
    ) {
      return {
        ...base,
        type: 'vessels',
        vessels: formatI18nNumber(reportVessels || 0, { locale }).toString(),
        ...vesselsQuantity,
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
      // One value per sublayer, so sublayers holding the same activity are counted once
      const sublayerIds = firstTimeseries.sublayers?.map((sublayer) => sublayer.id) || []
      const sumSublayer = (getValue: (t: (typeof formattedTimeseries)[number]) => any) =>
        sum(formattedTimeseries.map((t) => Number(getValue(t)) || 0))

      const hoursBySublayer = sublayerIds.map((_, i) => sumSublayer((t) => t.avg?.[i]))
      const maxHoursBySublayer = sublayerIds.map((_, i) => sumSublayer((t) => t.range?.[i]?.[1]))
      const sublayerDataviews = sublayerIds.flatMap(
        (id) => reportDataviews.find((dataview) => dataview.id === id) || []
      )
      const tilesMode: TilesHoursMode =
        sublayerDataviews.length === sublayerIds.length
          ? getTilesHoursMode(sublayerDataviews)
          : { mode: 'byLayer' }
      const isCounted = (_: number, i: number) =>
        tilesMode.mode === 'byLayer' || tilesMode.sublayerIds.includes(sublayerIds[i])

      const timeseriesHours = sum(hoursBySublayer.filter(isCounted))
      const timeseriesMaxHours = sum(maxHoursBySublayer.filter(isCounted))
      const formatHours = (hours: number) =>
        formatI18nNumber(hours > HOUR_ROUNDING_THRESHOLD ? hours.toFixed() : hours, { locale })
      const isTimeseriesQuantity = !timeseriesLoading && !!layersTimeseriesFiltered?.[0]
      if (isDetectionsFinished) {
        return { ...base, type: 'timeseries', ...vesselsQuantity, imprecision: 0 }
      }
      const byLayer = isTimeseriesQuantity && tilesMode.mode === 'byLayer' && sublayerIds.length > 1

      return {
        ...base,
        type: 'timeseries',
        quantity: String(isTimeseriesQuantity ? formatHours(timeseriesHours) : 0),
        byLayer: byLayer
          ? sublayerIds.map((id, i) => ({
              color: sublayerDataviews.find((dataview) => dataview.id === id)?.config?.color,
              hours: String(formatHours(hoursBySublayer[i])),
              imprecision: getImprecision(hoursBySublayer[i], maxHoursBySublayer[i]),
            }))
          : undefined,
        // Each layer carries its own when shown by layer
        imprecision: byLayer ? 0 : getImprecision(timeseriesHours, timeseriesMaxHours),
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
    hasReportHours,
    vesselsByLayer,
    timerange?.start,
    timerange?.end,
    reportStatus,
    reportOutdated,
    reportVessels,
    datasetIdsWithVessels,
    timeseriesLoading,
    reportDataviews,
  ])
}

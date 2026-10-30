import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { groupVmsSources } from 'features/_map/workspace/activity/activity.utils'
import { selectReportSubCategory } from 'features/_reports/reports.selectors'
import ReportSummaryPlaceholder from 'features/_reports/shared/placeholders/ReportSummaryPlaceholder'
import { useReportActivitySummaryData } from 'features/_reports/shared/summary/report-summary-activity.hooks'
import type { ReportActivityUnit } from 'features/_reports/tabs/activity/reports-activity.types'
import { getReportSubCategoryLabel } from 'features/_reports/tabs/activity/reports-activity.utils'
import { AsyncReducerStatus } from 'utils/async-slice'
import { htmlSafeParse } from 'utils/html-parser'
import { listAsSentence } from 'utils/shared'

export default function ReportSummaryActivity({
  activityUnit,
  reportStatus = AsyncReducerStatus.Finished,
}: {
  activityUnit: ReportActivityUnit
  reportStatus?: AsyncReducerStatus
}) {
  const { t } = useTranslation()
  const summary = useReportActivitySummaryData({ reportStatus })
  const reportSubCategory = useSelector(selectReportSubCategory)

  if (!summary) return <ReportSummaryPlaceholder />
  if (summary.type === 'timeCompare') return htmlSafeParse(summary.description)

  const area = summary.isGlobalReport
    ? t((t) => t.analysis.globally)
    : t((t) => t.analysis.inTheArea, { defaultValue: 'in the area' })
  const activityType =
    summary.datasetTitle ??
    (summary.isActivity
      ? `<strong>${t((t) => t.common.activity).toLowerCase()}</strong>`
      : // Detection layers of different sources have no common title, the subcategory is
        reportSubCategory
        ? getReportSubCategoryLabel(reportSubCategory).toLowerCase()
        : '')
  const unit = t((t) => t.common[activityUnit], { defaultValue: 'hours', count: summary.count })

  if (summary.type === 'vessels') {
    // Same VMS grouping as the layer source tags, the full list goes in a tooltip
    const groupedSources = groupVmsSources(
      summary.sources.map((label) => ({ id: label, label })),
      { inline: true }
    )
    const sources = groupedSources.length
      ? groupedSources.map(({ label, tooltip }) =>
          tooltip ? `<span data-tooltip="${tooltip}">${label}</span>` : label
        )
      : summary.sources
    return htmlSafeParse(
      t((t) => t.analysis.summary, {
        vessels: summary.vessels,
        activityQuantity: summary.quantity,
        activityUnit: unit,
        activityType,
        area,
        start: summary.start,
        end: summary.end,
        sources: ` (${listAsSentence(sources)})`,
      })
    )
  }

  const activityUnitLabel = summary.isActivity
    ? `<strong>${unit}</strong> ${
        summary.imprecision
          ? `<a href="https://globalfishingwatch.org/faqs/calculating-fishing-effort-estimates-in-dynamic-analysis-reports/" target="_blank"
                rel="noopener noreferrer" style="cursor: help" title="${t((t) => t.common.learnMore)}">± ${summary.imprecision}%</a> `
          : ''
      }${t((t) => t.common.of)}`
    : ''
  return htmlSafeParse(
    t((t) => t.analysis.summaryNoVessels, {
      activityQuantity: `<span>${summary.quantity}</span>`,
      activityUnit: activityUnitLabel,
      activityType,
      area,
      start: summary.start,
      end: summary.end,
    })
  )
}

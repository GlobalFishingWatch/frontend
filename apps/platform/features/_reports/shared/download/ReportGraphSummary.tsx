import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { groupVmsSources } from 'features/_map/workspace/activity/activity.utils'
import { selectReportAreaName } from 'features/_reports/report-area/area-reports.selectors'
import { selectReportCategory, selectReportSubCategory } from 'features/_reports/reports.selectors'
import { ReportCategory } from 'features/_reports/reports.types'
import { useReportActivitySummaryData } from 'features/_reports/shared/summary/report-summary-activity.hooks'
import ReportSummaryEvents from 'features/_reports/shared/summary/ReportSummaryEvents'
import { getReportSubCategoryLabel } from 'features/_reports/tabs/activity/reports-activity.utils'
import { htmlSafeParse } from 'utils/html-parser'
import { listAsSentence } from 'utils/shared'

import styles from './ReportGraphScreenshot.module.css'

type ReportGraphSummaryProps = {
  vesselsFiltered?: boolean
  hideSources?: boolean
}

function ReportGraphSummaryActivity({ vesselsFiltered, hideSources }: ReportGraphSummaryProps) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const areaName = useSelector(selectReportAreaName)
  const summary = useReportActivitySummaryData({ vesselsFiltered })

  if (!summary) return null
  if (summary.type === 'timeCompare') return htmlSafeParse(summary.description)

  const area = summary.isGlobalReport
    ? t((t) => t.analysis.globally)
    : areaName
      ? t((t) => t.analysis.inNamedArea, { area: areaName })
      : t((t) => t.analysis.inTheArea)
  const activityType =
    summary.datasetTitle ??
    (summary.isActivity
      ? `<strong>${(reportSubCategory
          ? getReportSubCategoryLabel(reportSubCategory)
          : t((t) => t.common.activity)
        ).toLowerCase()}</strong>`
      : '')
  const unit = t(
    (t) => t.common[reportCategory === ReportCategory.Activity ? 'hour' : 'detection'],
    {
      count: summary.count,
    }
  )

  if (summary.type === 'vessels') {
    const groupedSources = groupVmsSources(
      summary.sources.map((label) => ({ id: label, label })),
      { inline: true }
    ).map(({ label }) => label)
    // Filtered vessels don't keep their activity dataset, so their sources are unknown
    const sources =
      hideSources || vesselsFiltered ? [] : groupedSources.length ? groupedSources : summary.sources
    return htmlSafeParse(
      t((t) => t.analysis.summary, {
        vessels: summary.vessels,
        activityQuantity: summary.quantity,
        activityUnit: unit,
        activityType,
        area,
        start: summary.start,
        end: summary.end,
        sources: sources.length ? ` (${listAsSentence(sources)})` : '',
      })
    )
  }

  return htmlSafeParse(
    t((t) => t.analysis.summaryNoVessels, {
      activityQuantity: summary.quantity,
      activityUnit: summary.isActivity
        ? `<strong>${unit}</strong> ${summary.imprecision ? `± ${summary.imprecision}% ` : ''}${t((t) => t.common.of)}`
        : '',
      activityType,
      area,
      start: summary.start,
      end: summary.end,
    })
  )
}

/** What, where and when the report shows, as one sentence for graph screenshots */
function ReportGraphSummary(props: ReportGraphSummaryProps) {
  const reportCategory = useSelector(selectReportCategory)
  const areaName = useSelector(selectReportAreaName)

  return (
    <p className={styles.summary}>
      {reportCategory === ReportCategory.Events ? (
        <ReportSummaryEvents areaName={areaName} />
      ) : (
        <ReportGraphSummaryActivity {...props} />
      )}
    </p>
  )
}

export default ReportGraphSummary

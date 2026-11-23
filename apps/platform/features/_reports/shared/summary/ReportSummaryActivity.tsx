import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Icon } from '@globalfishingwatch/ui-components'

import { groupVmsSources } from 'features/_map/workspace/activity/activity.utils'
import { selectReportSubCategory } from 'features/_reports/reports.selectors'
import ReportSummaryPlaceholder from 'features/_reports/shared/placeholders/ReportSummaryPlaceholder'
import {
  getByLayerHtml,
  getImprecisionHtml,
} from 'features/_reports/shared/summary/report-summary.utils'
import { useReportActivitySummaryData } from 'features/_reports/shared/summary/report-summary-activity.hooks'
import type { ReportActivityUnit } from 'features/_reports/tabs/activity/reports-activity.types'
import { getReportSubCategoryLabel } from 'features/_reports/tabs/activity/reports-activity.utils'
import { htmlSafeParse } from 'utils/html-parser'
import { listAsSentence } from 'utils/shared'

import styles from './ReportSummary.module.css'

export default function ReportSummaryActivity({
  activityUnit,
}: {
  activityUnit: ReportActivityUnit
}) {
  const { t } = useTranslation()
  const summary = useReportActivitySummaryData()
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
  const learnMoreTitle = t((t) => t.common.learnMore)
  const activityQuantity = summary.byLayer
    ? getByLayerHtml(summary.byLayer, { learnMoreTitle })
    : summary.quantity

  let sentence: string
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
    sentence = t((t) => t.analysis.summary, {
      vessels: summary.vessels,
      activityQuantity,
      activityUnit: unit,
      activityType,
      area,
      start: summary.start,
      end: summary.end,
      sources: ` (${listAsSentence(sources)})`,
    })
  } else {
    const activityUnitLabel = summary.isActivity
      ? `<strong>${unit}</strong> ${
          summary.imprecision
            ? `${getImprecisionHtml(summary.imprecision, { learnMoreTitle })} `
            : ''
        }${t((t) => t.common.of)}`
      : ''
    sentence = t((t) => t.analysis.summaryNoVessels, {
      activityQuantity: `<span>${activityQuantity}</span>`,
      activityUnit: activityUnitLabel,
      activityType,
      area,
      start: summary.start,
      end: summary.end,
    })
  }

  return (
    <Fragment>
      {htmlSafeParse(sentence)}
      {summary.byLayer && (
        <div className={styles.disclaimer}>
          <Icon icon="warning" type="warning" />
          {t((t) => t.analysis.hoursByLayerDisclaimer)}
        </div>
      )}
    </Fragment>
  )
}

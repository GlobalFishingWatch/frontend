import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectLatestAvailableDataDate } from 'features/_map/workspace/selectors/app.data-date.selectors'
import { formatTooltipValue } from 'features/_reports/report-area/area-reports.utils'
import { selectReportTimeComparison } from 'features/_reports/reports.config.selectors'
import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'
import type { TimeComparisonGraph } from 'features/_reports/reports-timeseries.utils'
import { getTimeComparisonTotals } from 'features/_reports/reports-timeseries.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'

import { COLOR_DECREASE, COLOR_INCREASE } from './PeriodComparisonGraphTooltip'

import styles from './ReportActivityComparisonTotals.module.css'

export default function ReportActivityComparisonTotals({
  data,
  graph,
}: {
  data: ReportGraphProps
  graph: TimeComparisonGraph
}) {
  const { t } = useTranslation()
  const timeComparison = useSelector(selectReportTimeComparison)
  const latestAvailableDataDate = useSelector(selectLatestAvailableDataDate)
  const { timeseries, sublayers } = data || ({} as ReportGraphProps)
  const unit = sublayers?.[0]?.legend?.unit

  const totals = useMemo(
    () =>
      getTimeComparisonTotals(
        timeseries,
        graph,
        timeComparison?.compareStart,
        latestAvailableDataDate
      ),
    [graph, latestAvailableDataDate, timeComparison, timeseries]
  )

  if (!totals) {
    return null
  }

  const { baseline, comparison } = totals
  const change = comparison - baseline
  const changePercentage = baseline ? (change / baseline) * 100 : undefined

  return (
    <ul className={styles.totals}>
      <li className={styles.total}>
        <label className={styles.label}>
          {graph === 'beforeAfter'
            ? t((t) => t.analysis.comparisonTotalBefore)
            : t((t) => t.analysis.comparisonTotalBaseline)}
        </label>
        {formatTooltipValue(baseline, unit as string)}
      </li>
      <li className={styles.total}>
        <label className={styles.label}>
          {graph === 'beforeAfter'
            ? t((t) => t.analysis.comparisonTotalAfter)
            : t((t) => t.analysis.comparisonTotalCompared)}
        </label>
        {formatTooltipValue(comparison, unit as string)}
      </li>
      <li className={styles.total}>
        <label className={styles.label}>{t((t) => t.analysis.comparisonTotalChange)}</label>
        <span>
          <span
            className={styles.changeDot}
            style={{ color: change > 0 ? COLOR_INCREASE : COLOR_DECREASE }}
          ></span>
          {formatTooltipValue(change, unit as string, true)}
          {changePercentage !== undefined && (
            <span className={styles.percentage}>
              ({formatI18nNumber(changePercentage, { maximumFractionDigits: 1 })}%)
            </span>
          )}
        </span>
      </li>
    </ul>
  )
}

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectLatestAvailableDataDate } from 'features/_map/workspace/selectors/app.data-date.selectors'
import { formatTooltipValue } from 'features/_reports/report-area/area-reports.utils'
import { selectReportTimeComparison } from 'features/_reports/reports.config.selectors'
import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import { getUTCDateTime } from 'utils/dates'

import { COLOR_DECREASE, COLOR_INCREASE } from './PeriodComparisonGraphTooltip'

import styles from './ReportActivityComparisonTotals.module.css'

type ComparisonGraph = 'beforeAfter' | 'periodComparison'

// min and max are the bounds of the estimate for each bucket, same average the graphs plot
const bucketAvg = (min: number, max: number) => (min + max) / 2

export default function ReportActivityComparisonTotals({
  data,
  graph,
}: {
  data: ReportGraphProps
  graph: ComparisonGraph
}) {
  const { t } = useTranslation()
  const timeComparison = useSelector(selectReportTimeComparison)
  const latestAvailableDataDate = useSelector(selectLatestAvailableDataDate)
  const { timeseries, sublayers } = data || ({} as ReportGraphProps)
  const unit = sublayers?.[0]?.legend?.unit

  const totals = useMemo(() => {
    if (!timeseries?.length || !timeComparison?.compareStart) {
      return null
    }
    const latestDataMillis = getUTCDateTime(latestAvailableDataDate)?.toMillis()

    if (graph === 'periodComparison') {
      const compareStartIndex = timeseries.findIndex((t) => t.date === timeComparison.compareStart)
      if (compareStartIndex <= 0) {
        return null
      }
      const baselineBuckets = timeseries.slice(0, compareStartIndex)
      const comparisonBuckets = timeseries.slice(compareStartIndex)
      // The graph pairs both periods bucket by bucket, so only paired buckets are comparable
      const pairs = Math.min(baselineBuckets.length, comparisonBuckets.length)
      let baseline = 0
      let comparison = 0
      for (let index = 0; index < pairs; index++) {
        const comparisonDate = getUTCDateTime(comparisonBuckets[index].date)?.toMillis()
        if (latestDataMillis && comparisonDate > latestDataMillis) {
          // Beyond the last available data the comparison period has no values to compare against
          break
        }
        baseline += bucketAvg(baselineBuckets[index].min[0], baselineBuckets[index].max[0])
        comparison += bucketAvg(comparisonBuckets[index].min[1], comparisonBuckets[index].max[1])
      }
      return { baseline, comparison }
    }

    // Before/after: values before the comparison date are in sublayer 0 and values after in sublayer 1
    const compareStartMillis = getUTCDateTime(timeComparison.compareStart)?.toMillis()
    return timeseries.reduce(
      (acc, { date, min, max }) => {
        const dateMillis = getUTCDateTime(date)?.toMillis()
        if (latestDataMillis && dateMillis > latestDataMillis) {
          return acc
        }
        const value = bucketAvg(
          min.reduce((total, v) => total + v, 0),
          max.reduce((total, v) => total + v, 0)
        )
        if (dateMillis < compareStartMillis) {
          acc.baseline += value
        } else {
          acc.comparison += value
        }
        return acc
      },
      { baseline: 0, comparison: 0 }
    )
  }, [graph, latestAvailableDataDate, timeComparison, timeseries])

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
        <span style={{ color: change > 0 ? COLOR_INCREASE : COLOR_DECREASE }}>
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

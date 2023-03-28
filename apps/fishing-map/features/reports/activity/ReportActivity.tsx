import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import ReportActivityGraphSelector from 'features/reports/activity/ReportActivityGraphSelector'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  getReportGraphMode,
  ReportGraphProps,
  useFilteredTimeSeries,
} from 'features/reports/reports-timeseries.hooks'
import { selectTimeComparisonValues } from 'features/reports/reports.selectors'
import { ReportActivityGraph } from 'types'
import { selectReportActivityGraph } from 'features/app/app.selectors'
import ReportActivityPlaceholder from 'features/reports/placeholders/ReportActivityPlaceholder'
import ReportActivityPeriodComparison from 'features/reports/activity/ReportActivityPeriodComparison'
import ReportActivityPeriodComparisonGraph from 'features/reports/activity/ReportActivityPeriodComparisonGraph'
import ReportActivityEvolution from './ReportActivityEvolution'
import ReportActivityBeforeAfter from './ReportActivityBeforeAfter'
import ReportActivityBeforeAfterGraph from './ReportActivityBeforeAfterGraph'
import styles from './ReportActivity.module.css'

export type ReportActivityProps = {
  data: ReportGraphProps
  start: string
  end: string
}

const SELECTORS_BY_TYPE: Record<ReportActivityGraph, React.FC> = {
  evolution: null,
  beforeAfter: ReportActivityBeforeAfter,
  periodComparison: ReportActivityPeriodComparison,
}
const GRAPH_BY_TYPE: Record<ReportActivityGraph, React.FC<ReportActivityProps> | null> = {
  evolution: ReportActivityEvolution,
  beforeAfter: ReportActivityBeforeAfterGraph,
  periodComparison: ReportActivityPeriodComparisonGraph,
}

const emptyGraphData = {} as ReportGraphProps
export default function ReportActivity() {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const reportActivityGraph = useSelector(selectReportActivityGraph)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)

  const SelectorsComponent = useMemo(
    () => SELECTORS_BY_TYPE[reportActivityGraph],
    [reportActivityGraph]
  )
  const GraphComponent = useMemo(() => GRAPH_BY_TYPE[reportActivityGraph], [reportActivityGraph])
  const { loading, layersTimeseriesFiltered } = useFilteredTimeSeries()
  const reportGraphMode = getReportGraphMode(reportActivityGraph)
  const isSameTimeseriesMode = layersTimeseriesFiltered?.[0]?.mode === reportGraphMode
  const showSelectors = layersTimeseriesFiltered !== undefined
  return (
    <div className={styles.container}>
      {showSelectors && (
        <div className={styles.titleRow}>
          <label className={styles.blockTitle}>{t('common.activity', 'Activity')}</label>
          <ReportActivityGraphSelector />
        </div>
      )}
      {loading || !isSameTimeseriesMode ? (
        <ReportActivityPlaceholder showHeader={!showSelectors} />
      ) : (
        <GraphComponent
          start={reportActivityGraph === 'evolution' ? start : timeComparisonValues?.start}
          end={reportActivityGraph === 'evolution' ? end : timeComparisonValues?.end}
          data={isSameTimeseriesMode ? layersTimeseriesFiltered?.[0] : emptyGraphData}
        />
      )}
      {showSelectors && SelectorsComponent && <SelectorsComponent />}
      <p className={styles.disclaimer}>
        <Trans i18nKey="analysis.disclaimer">
          The data shown above should be taken as an estimate.
          <a href="https://globalfishingwatch.org/faqs/" target="_blank" rel="noreferrer">
            Find out more about Global Fishing Watch analysis tools and methods.
          </a>
        </Trans>
      </p>
    </div>
  )
}

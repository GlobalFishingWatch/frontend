import React, { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import ReportActivityGraphSelector from 'features/reports/ReportActivityGraphSelector'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { ReportGraphProps, useFilteredTimeSeries } from 'features/reports/reports-timeseries.hooks'
import { selectTimeComparisonValues } from 'features/reports/reports.selectors'
import { ReportActivityGraph } from 'types'
import { selectReportActivityGraph } from 'features/app/app.selectors'
import ReportActivityEvolution from './ReportActivityEvolution'
import ReportActivityBeforeAfter from './ReportActivityBeforeAfter'
import styles from './ReportActivity.module.css'

export type ReportActivityProps = {
  data: ReportGraphProps
  start: string
  end: string
}

const REPORT_BY_TYPE: Record<ReportActivityGraph, React.FC<ReportActivityProps> | null> = {
  evolution: ReportActivityEvolution,
  periodComparison: ReportActivityBeforeAfter,
  beforeAfter: ReportActivityBeforeAfter,
}

export default function ReportActivity() {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const reportActivityGraph = useSelector(selectReportActivityGraph)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)

  const ReportGraphComponent = useMemo(
    () => REPORT_BY_TYPE[reportActivityGraph],
    [reportActivityGraph]
  )
  const { loading, layersTimeseriesFiltered } = useFilteredTimeSeries()
  if (
    (!loading && !layersTimeseriesFiltered?.[0]?.timeseries) ||
    layersTimeseriesFiltered?.[0]?.timeseries?.length === 0
  )
    return
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      ) : (
        <Fragment>
          <div className={styles.titleRow}>
            <label className={styles.blockTitle}>{t('common.activity', 'Activity')}</label>
            <ReportActivityGraphSelector />
          </div>
          <ReportGraphComponent
            start={reportActivityGraph === 'evolution' ? start : timeComparisonValues?.start}
            end={reportActivityGraph === 'evolution' ? end : timeComparisonValues?.end}
            data={layersTimeseriesFiltered?.[0]}
          />
        </Fragment>
      )}
    </div>
  )
}

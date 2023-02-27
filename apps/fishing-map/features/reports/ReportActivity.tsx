import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import ReportActivityGraphSelector from 'features/reports/ReportActivityGraphSelector'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  ReportGraphProps,
  useFilteredTimeSeriesByArea,
} from 'features/reports/reports-timeseries.hooks'
import { selectReportAreaIds, selectTimeComparisonValues } from 'features/reports/reports.selectors'
import { selectDatasetAreaDetail, selectDatasetAreaStatus } from 'features/areas/areas.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { ReportActivityGraph } from 'types'
import { selectReportActivityGraph } from 'features/app/app.selectors'
import { ReportActivityUnit } from './Report'
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

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
}

export default function ReportActivity({ activityUnit }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const reportArea = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const reportAreaStatus = useSelector(selectDatasetAreaStatus(reportAreaIds))
  const reportActivityGraph = useSelector(selectReportActivityGraph)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)

  const { loading, layersTimeseriesFiltered } = useFilteredTimeSeriesByArea(
    reportAreaStatus === AsyncReducerStatus.Finished ? reportArea : undefined
  )

  const ReportGraphComponent = useMemo(
    () => REPORT_BY_TYPE[reportActivityGraph],
    [reportActivityGraph]
  )
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <label className={styles.blockTitle}>{t('common.activity', 'Activity')}</label>
        <ReportActivityGraphSelector />
      </div>
      {loading ? (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      ) : (
        <ReportGraphComponent
          start={reportActivityGraph === 'evolution' ? start : timeComparisonValues.start}
          end={reportActivityGraph === 'evolution' ? end : timeComparisonValues.end}
          data={layersTimeseriesFiltered?.[0]}
        />
      )}
    </div>
  )
}

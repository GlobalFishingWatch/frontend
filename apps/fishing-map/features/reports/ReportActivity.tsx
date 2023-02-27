import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import ReportActivityGraphSelector from 'features/reports/ReportActivityGraphSelector'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useFilteredTimeSeriesByArea } from 'features/reports/reports-timeseries.hooks'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import { selectDatasetAreaDetail, selectDatasetAreaStatus } from 'features/areas/areas.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { ReportActivityUnit } from './Report'
import ReportActivityGraph from './ReportActivityGraph'
import styles from './ReportActivity.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
}

export default function ReportActivity({ activityUnit }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const reportArea = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const reportAreaStatus = useSelector(selectDatasetAreaStatus(reportAreaIds))

  const { loading, layersTimeseriesFiltered } = useFilteredTimeSeriesByArea(
    reportAreaStatus === AsyncReducerStatus.Finished ? reportArea : undefined
  )
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <label className={styles.blockTitle}>{t('common.activity', 'Activity')}</label>
        <ReportActivityGraphSelector />
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <ReportActivityGraph start={start} end={end} data={layersTimeseriesFiltered?.[0]} />
      )}
    </div>
  )
}

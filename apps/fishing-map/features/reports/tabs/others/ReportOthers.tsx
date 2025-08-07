import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DatasetTypes } from '@globalfishingwatch/api-types'

import { selectOthersActiveReportDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import {
  useComputeReportTimeSeries,
  useReportFilteredTimeSeries,
  useTimeseriesStats,
} from 'features/reports/reports-timeseries.hooks'
import { getStatsValue } from 'features/reports/reports-timeseries-shared.utils'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import styles from './ReportOthers.module.css'

function ReportOthers() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const timeseriesStats = useTimeseriesStats()
  const otherDataviews = useSelector(selectOthersActiveReportDataviews)

  if (!otherDataviews?.length) return null

  return (
    <Fragment>
      {otherDataviews.map((dataview, index) => {
        const dataset = dataview.datasets?.find(
          (d) => d.type === DatasetTypes.UserContext || d.type === DatasetTypes.Context
        )
        const title = getDatasetNameTranslated(dataset)
        const unit =
          dataset?.unit && dataset.unit !== 'TBD' && dataset.unit !== 'NA'
            ? dataset.unit
            : undefined
        const total = timeseriesStats?.[dataview.id]
          ? getStatsValue(timeseriesStats[dataview.id], 'total')
          : undefined

        return (
          <div key={dataview.id} className={styles.container}>
            <p className={styles.summary}>
              <strong>{title}</strong> {unit && <span>({unit})</span>} <br />
              {timeseriesStats?.[dataview.id] && (
                <Fragment>
                  {total !== undefined && <span>{total}</span>} {t('common.between')}{' '}
                  <strong>{formatI18nDate(start)}</strong> {t('common.and')}{' '}
                  <strong>{formatI18nDate(end)}</strong>
                </Fragment>
              )}
            </p>
            <ReportActivityEvolution
              start={start}
              end={end}
              data={layersTimeseriesFiltered?.[index]}
            />
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportOthers

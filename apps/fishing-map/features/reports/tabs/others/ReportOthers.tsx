import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'

import { selectOthersActiveReportDataviewsGrouped } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import {
  useComputeReportTimeSeries,
  useReportFilteredTimeSeries,
  useTimeseriesStats,
} from 'features/reports/reports-timeseries.hooks'
import { getStatsValue } from 'features/reports/reports-timeseries-shared.utils'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import styles from './ReportOthers.module.css'
import summaryStyles from 'features/reports/shared/summary/ReportSummary.module.css'

function ReportOthers() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const timeseriesStats = useTimeseriesStats()
  const otherDataviews = useSelector(selectOthersActiveReportDataviewsGrouped)

  if (!Object.keys(otherDataviews)?.length) return null

  return (
    <Fragment>
      {Object.values(otherDataviews).map((dataviews, index) => {
        const dataview = dataviews[0]
        const dataset = dataview.datasets?.find(
          (d) => d.type === DatasetTypes.UserContext || d.type === DatasetTypes.Context
        )
        const timeFilterType = getDatasetConfigurationProperty({
          dataset,
          property: 'timeFilterType',
        })
        const hasTimeFilter = timeFilterType === 'dateRange' || timeFilterType === 'date'
        const title = getDatasetNameTranslated(dataset)
        const unit =
          dataset?.unit && dataset.unit !== 'TBD' && dataset.unit !== 'NA'
            ? dataset.unit
            : undefined
        const total = timeseriesStats?.[dataview.id]
          ? getStatsValue(timeseriesStats[dataview.id], 'total')
          : undefined

        const StatsComponent = timeseriesStats?.[dataview.id] ? (
          <p className={cx(styles.summary)}>
            <Fragment>
              {total !== undefined && (
                <span>
                  {total} {t('common.points', { count: total })}
                </span>
              )}{' '}
              {t('common.between')} <strong>{formatI18nDate(start)}</strong> {t('common.and')}{' '}
              <strong>{formatI18nDate(end)}</strong>
            </Fragment>
          </p>
        ) : null
        return (
          <div key={dataview.id} className={styles.container}>
            <h2 className={styles.title}>{title}</h2> {unit && <span>({unit})</span>}
            {hasTimeFilter && StatsComponent}
            {dataviews?.length > 0 && (
              <div className={summaryStyles.tagsContainer}>
                {dataviews?.map((d) => (
                  <ReportSummaryTags key={d.id} dataview={d} />
                ))}
              </div>
            )}
            {!hasTimeFilter && StatsComponent}
            {hasTimeFilter && (
              <ReportActivityEvolution
                start={start}
                end={end}
                data={layersTimeseriesFiltered?.[index]}
              />
            )}
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportOthers

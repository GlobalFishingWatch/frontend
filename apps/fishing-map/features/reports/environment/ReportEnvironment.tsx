import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { selectActiveReportDataviews, selectTimeRange } from 'features/app/app.selectors'
import { useFilteredTimeSeries } from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/placeholders/ReportActivityPlaceholder'
import { getDatasetNameTranslated } from 'features/i18n/utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import ReportActivityEvolution from '../activity/ReportActivityEvolution'
import styles from './ReportEnvironment.module.css'

function ReportEnvironment() {
  const { t } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const { loading, layersTimeseriesFiltered } = useFilteredTimeSeries()
  const environmentalDataviews = useSelector(selectActiveReportDataviews)

  if (!environmentalDataviews?.length) return null

  return (
    <Fragment>
      {environmentalDataviews.map((dataview, index) => {
        const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
        const title = getDatasetNameTranslated(dataset)
        const unit = dataset?.unit
        return (
          <div key={dataview.id} className={styles.container}>
            <p className={styles.summary}>
              <strong>{title}</strong> {unit && <span>({unit})</span>}{' '}
              {t('common.between', 'betweeen')} <strong>{formatI18nDate(timerange.start)}</strong>{' '}
              {t('common.and', 'and')} <strong>{formatI18nDate(timerange.end)}</strong>
            </p>
            {loading ? (
              <ReportActivityPlaceholder showHeader={false} />
            ) : (
              <ReportActivityEvolution
                start={timerange.start}
                end={timerange.end}
                data={layersTimeseriesFiltered!?.[index]}
              />
            )}
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportEnvironment

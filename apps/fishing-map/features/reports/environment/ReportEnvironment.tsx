import React, { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import { selectActiveReportDataviews } from 'features/app/selectors/app.reports.selector'
import {
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/placeholders/ReportActivityPlaceholder'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import ReportActivityEvolution from '../activity/ReportActivityEvolution'
import styles from './ReportEnvironment.module.css'

function ReportEnvironment() {
  const { t } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const loading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const environmentalDataviews = useSelector(selectActiveReportDataviews)

  if (!environmentalDataviews?.length) return null

  return (
    <Fragment>
      {environmentalDataviews.map((dataview, index) => {
        const isDynamic = dataview.config?.type === GeneratorType.HeatmapAnimated
        const { min, mean, max } = dataview.config?.stats || {}
        const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
        const title = getDatasetNameTranslated(dataset)
        const unit = dataset?.unit
        return (
          <div key={dataview.id} className={styles.container}>
            <p className={styles.summary}>
              <strong>{title}</strong> {unit && <span>({unit})</span>}{' '}
              {isDynamic && (
                <Fragment>
                  {t('common.between', 'betweeen')}{' '}
                  <strong>{formatI18nDate(timerange.start)}</strong> {t('common.and', 'and')}{' '}
                  <strong>{formatI18nDate(timerange.end)}</strong>
                </Fragment>
              )}
            </p>
            {isDynamic ? (
              loading ? (
                <ReportActivityPlaceholder showHeader={false} />
              ) : (
                <ReportActivityEvolution
                  start={timerange.start}
                  end={timerange.end}
                  data={layersTimeseriesFiltered!?.[index]}
                />
              )
            ) : null}
            {!loading && min && mean && max && (
              <div className={cx(styles.stats, { [styles.marginTop]: isDynamic })}>
                <div>
                  <label>
                    {t('analysis.stats.min', 'Min')}{' '}
                    <Tooltip
                      content={t(
                        'analysis.stats.minHelp',
                        'Minimum value of a cell contained or overlapping your area of interest'
                      )}
                    >
                      <IconButton icon="info" size="tiny" />
                    </Tooltip>
                  </label>
                  <p>{formatI18nNumber(min, { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <label>
                    {t('analysis.stats.mean', 'Avg')}{' '}
                    <Tooltip
                      content={t(
                        'analysis.stats.meanHelp',
                        'Average value of the cells contained or overlapping your area of interest'
                      )}
                    >
                      <IconButton icon="info" size="tiny" />
                    </Tooltip>
                  </label>
                  <p>{formatI18nNumber(mean, { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <label>
                    {t('analysis.stats.max', 'Max')}{' '}
                    <Tooltip
                      content={t(
                        'analysis.stats.maxHelp',
                        'Maximum value of a cell contained or overlapping your area of interest'
                      )}
                    >
                      <IconButton icon="info" size="tiny" />
                    </Tooltip>
                  </label>
                  <p>{formatI18nNumber(max, { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportEnvironment

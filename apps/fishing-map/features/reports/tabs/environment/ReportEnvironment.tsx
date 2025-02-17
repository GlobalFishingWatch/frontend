import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import htmlParse from 'html-react-parser'

import { DatasetTypes, DataviewType } from '@globalfishingwatch/api-types'
import { getAvailableIntervalsInDataviews } from '@globalfishingwatch/deck-layer-composer'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
  useTimeseriesStats,
} from 'features/reports/tabs/activity/reports-activity-timeseries.hooks'
import { upperFirst } from 'utils/info'

import styles from './ReportEnvironment.module.css'

function ReportEnvironment() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const loading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const timeseriesStats = useTimeseriesStats()
  const environmentalDataviews = useSelector(selectActiveReportDataviews)
  const allAvailableIntervals = getAvailableIntervalsInDataviews(environmentalDataviews)
  const interval = getFourwingsInterval(timerange.start, timerange.end, allAvailableIntervals)

  if (!environmentalDataviews?.length) return null

  return (
    <Fragment>
      {environmentalDataviews.map((dataview, index) => {
        const isDynamic = dataview.config?.type === DataviewType.HeatmapAnimated
        const { min, mean, max } = timeseriesStats[dataview.id] || {}
        const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
        const title = getDatasetNameTranslated(dataset)
        const isLoading = loading || layersTimeseriesFiltered?.[index]?.mode === 'loading'
        const unit = dataset?.unit
        return (
          <div key={dataview.id} className={styles.container}>
            <p className={styles.summary}>
              {dataset?.configuration?.function === 'AVG' && (
                <span>{upperFirst(t('common.average', 'Average'))} </span>
              )}
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
              isLoading || !layersTimeseriesFiltered?.[index] ? (
                <ReportActivityPlaceholder showHeader={false} />
              ) : (
                <ReportActivityEvolution
                  start={timerange.start}
                  end={timerange.end}
                  data={layersTimeseriesFiltered?.[index]}
                />
              )
            ) : null}
            {!isLoading && min && mean && max && (
              <p className={cx(styles.disclaimer, { [styles.marginTop]: isDynamic })}>
                {isDynamic
                  ? t('analysis.statsDisclaimerDynamic', {
                      defaultValue:
                        'During this time, the minimum and maximum values at any given {{interval}} and place inside your area were {{min}} {{unit}} and {{max}} {{unit}}.',
                      interval: t(`common.${interval.toLowerCase()}s` as any, {
                        count: 1,
                      }).toLowerCase(),
                      min: formatI18nNumber(min, { maximumFractionDigits: 2 }),
                      max: formatI18nNumber(max, { maximumFractionDigits: 2 }),
                      unit,
                    })
                  : t('analysis.statsDisclaimerStatic', {
                      defaultValue:
                        'The average value for your area is {{mean}} {{unit}}. The minimum and maximum are {{min}} {{unit}} and {{max}} {{unit}}.',
                      min: formatI18nNumber(min, { maximumFractionDigits: 2 }),
                      max: formatI18nNumber(max, { maximumFractionDigits: 2 }),
                      mean: formatI18nNumber(mean, { maximumFractionDigits: 2 }),
                      unit,
                    })}{' '}
                {dataset?.source && (
                  <span>
                    {t('analysis.dataSource', 'Data source')}: {htmlParse(dataset.source)}
                  </span>
                )}
              </p>
            )}
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportEnvironment

import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import htmlParse from 'html-react-parser'

import { DatasetTypes, DataviewType } from '@globalfishingwatch/api-types'
import { getAvailableIntervalsInDataviews } from '@globalfishingwatch/deck-layer-composer'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/reports/shared/placeholders/ReportStatsPlaceholder'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import ReportCurrentsGraph from 'features/reports/tabs/activity/ReportCurrentsGraph'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredFeatures,
  useReportFilteredTimeSeries,
  useReportTimeSeriesErrors,
  useTimeseriesStats,
} from 'features/reports/tabs/activity/reports-activity-timeseries.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { upperFirst } from 'utils/info'

import styles from './ReportEnvironment.module.css'

function ReportEnvironment() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const loading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const layersFilteredFeatures = useReportFilteredFeatures()
  const timeseriesStats = useTimeseriesStats()
  const environmentalDataviews = useSelector(selectActiveReportDataviews)
  const allAvailableIntervals = getAvailableIntervalsInDataviews(environmentalDataviews)
  const interval = getFourwingsInterval(start, end, allAvailableIntervals)
  const layersTimeseriesErrors = useReportTimeSeriesErrors()

  if (!environmentalDataviews?.length) return null

  return (
    <Fragment>
      {environmentalDataviews.map((dataview, index) => {
        const isDynamic = dataview.config?.type === DataviewType.HeatmapAnimated
        const { min, mean, max } = timeseriesStats?.[dataview.id] || {}
        const isCurrents = dataview.config?.type === DataviewType.Currents
        const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
        const title = getDatasetNameTranslated(dataset)
        const hasError =
          layersTimeseriesErrors?.[index] !== undefined && layersTimeseriesErrors?.[index] !== ''
        const isLoading = loading || layersTimeseriesFiltered?.[index]?.mode === 'loading'
        const unit = dataset?.unit
        return (
          <div key={dataview.id} className={styles.container}>
            <p className={styles.summary}>
              {dataset?.configuration?.function === 'AVG' && (
                <span>{upperFirst(t('common.average'))} </span>
              )}
              <strong>{title}</strong> {unit && <span>({unit})</span>}{' '}
              {(isDynamic || isCurrents) && (
                <Fragment>
                  {t('common.between')} <strong>{formatI18nDate(start)}</strong> {t('common.and')}{' '}
                  <strong>{formatI18nDate(end)}</strong>
                </Fragment>
              )}
            </p>
            {isDynamic || isCurrents ? (
              isLoading || !layersTimeseriesFiltered?.[index] || hasError ? (
                <ReportActivityPlaceholder showHeader={false}>
                  {hasError && <p className={styles.errorMessage}>{t('errors.layerLoading')}</p>}
                </ReportActivityPlaceholder>
              ) : isCurrents && layersFilteredFeatures?.[index] ? (
                <Fragment>
                  <ReportCurrentsGraph
                    color={dataview.config?.color}
                    data={layersFilteredFeatures?.[index]}
                  />
                  {/* TODO: add this graph when we calculate the currents timeseries properly */}
                  {/* <ReportActivityEvolution
                    start={timerange.start}
                    end={timerange.end}
                    data={layersTimeseriesFiltered?.[index]}
                  /> */}
                </Fragment>
              ) : (
                <ReportActivityEvolution
                  start={start}
                  end={end}
                  data={layersTimeseriesFiltered?.[index]}
                />
              )
            ) : null}
            {isLoading ? (
              <ReportStatsPlaceholder />
            ) : min !== undefined && mean !== undefined && max !== undefined ? (
              <p className={cx(styles.disclaimer, { [styles.marginTop]: isDynamic })}>
                {isDynamic
                  ? t('analysis.statsDisclaimerDynamic', {
                      interval: t(`common.${interval.toLowerCase()}s` as any, {
                        count: 1,
                      }).toLowerCase(),
                      min: formatI18nNumber(min, { maximumFractionDigits: 2 }),
                      max: formatI18nNumber(max, { maximumFractionDigits: 2 }),
                      unit,
                    })
                  : t('analysis.statsDisclaimerStatic', {
                      min: formatI18nNumber(min, { maximumFractionDigits: 2 }),
                      max: formatI18nNumber(max, { maximumFractionDigits: 2 }),
                      mean: formatI18nNumber(mean, { maximumFractionDigits: 2 }),
                      unit,
                    })}{' '}
                {dataset?.source && (
                  <span>
                    {t('analysis.dataSource')}: {htmlParse(dataset.source)}
                  </span>
                )}
              </p>
            ) : null}
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportEnvironment

import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import htmlParse from 'html-react-parser'

import { DatasetTypes, DataviewType } from '@globalfishingwatch/api-types'
import { getAvailableIntervalsInDataviews } from '@globalfishingwatch/deck-layer-composer'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { selectReportComparisonDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import type { FourwingsReportGraphStats } from 'features/reports/reports-timeseries.hooks'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredFeatures,
  useReportFilteredTimeSeries,
  useReportTimeSeriesErrors,
  useTimeseriesStats,
} from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/reports/shared/placeholders/ReportStatsPlaceholder'
import ReportCurrentsGraph from 'features/reports/tabs/activity/ReportCurrentsGraph'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import ReportActivityGraphSelector from '../activity/ReportActivityGraphSelector'

import ReportEnvironmentComparisonGraph from './ReportEnvironmentComparisonGraph'
import ReportEnvironmentEvolutionGraph from './ReportEnvironmentEvolutionGraph'

import styles from './ReportEnvironment.module.css'

function ReportEnvironment() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const loading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const layersFilteredFeatures = useReportFilteredFeatures()
  const timeseriesStats = useTimeseriesStats()
  const environmentalDataviews = useSelector(selectReportComparisonDataviews)
  const allAvailableIntervals = getAvailableIntervalsInDataviews(environmentalDataviews)
  const interval = getFourwingsInterval(start, end, allAvailableIntervals)
  const layersTimeseriesErrors = useReportTimeSeriesErrors()
  const reportGraphType = useSelector(selectReportActivityGraph)

  if (!environmentalDataviews?.length) return null

  const isDynamic = environmentalDataviews[0]?.config?.type === DataviewType.HeatmapAnimated
  const { min, mean, max } =
    (timeseriesStats?.[environmentalDataviews[0]?.id] as FourwingsReportGraphStats) || {}
  const isCurrents = environmentalDataviews[0]?.config?.type === DataviewType.Currents
  const dataset = environmentalDataviews[0]?.datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings
  )
  const index = 0
  const hasError =
    layersTimeseriesErrors?.[index] !== undefined && layersTimeseriesErrors?.[index] !== ''
  const isLoading = loading || layersTimeseriesFiltered?.[index]?.mode === 'loading'
  const unit = dataset?.unit

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <label className={styles.blockTitle}>{t('common.environment')}</label>
        <ReportActivityGraphSelector loading={loading} />
      </div>
      <div>
        {reportGraphType === 'evolution' ? (
          <ReportEnvironmentEvolutionGraph />
        ) : (
          <ReportEnvironmentComparisonGraph />
        )}
        {isLoading || !layersTimeseriesFiltered?.[index] || hasError ? (
          <ReportActivityPlaceholder showHeader={false}>
            {hasError && <p className={styles.errorMessage}>{t('errors.layerLoading')}</p>}
          </ReportActivityPlaceholder>
        ) : (isDynamic || isCurrents) && layersFilteredFeatures?.[index] ? (
          <Fragment>
            <ReportCurrentsGraph
              color={environmentalDataviews[0]?.config?.color}
              data={layersFilteredFeatures?.[index]}
            />
            {/* TODO: add this graph when we calculate the currents timeseries properly */}
            {/* <ReportActivityEvolution
                    start={timerange.start}
                    end={timerange.end}
                    data={layersTimeseriesFiltered?.[index]}
                  /> */}
          </Fragment>
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
    </div>
  )
}

export default ReportEnvironment

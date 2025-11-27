import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import htmlParse from 'html-react-parser'

import type { DataviewType } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { isEnvironmentalDataview } from '@globalfishingwatch/dataviews-client'
import { getAvailableIntervalsInDataviews } from '@globalfishingwatch/deck-layer-composer'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import type {
  FourwingsReportGraphStats,
  ReportGraphProps,
} from 'features/reports/reports-timeseries.hooks'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
  useReportTimeSeriesErrors,
  useTimeseriesStats,
} from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/reports/shared/placeholders/ReportStatsPlaceholder'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { upperFirst } from 'utils/info'

import styles from './ReportEnvironment.module.css'

function ReportEnvironmentGraph({
  GraphComponent,
  dataview,
  data,
  index = 0,
  isLoading = false,
}: {
  GraphComponent: React.ComponentType<any>
  dataview: UrlDataviewInstance<DataviewType>
  data: ReportGraphProps | ReportGraphProps[]
  isLoading?: boolean
  index?: number
}) {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const timeseriesStats = useTimeseriesStats()
  const allAvailableIntervals = getAvailableIntervalsInDataviews([dataview])
  const interval = getFourwingsInterval(start, end, allAvailableIntervals)
  const layersTimeseriesErrors = useReportTimeSeriesErrors()
  const isDynamic = isEnvironmentalDataview(dataview) // checks for animated heatmaps

  if (!dataview) return null

  const { min, mean, max } = (timeseriesStats?.[dataview.id] as FourwingsReportGraphStats) || {}
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
  const title = getDatasetNameTranslated(dataset)
  const hasError =
    layersTimeseriesErrors?.[index] !== undefined && layersTimeseriesErrors?.[index] !== ''
  const unit = dataset?.unit

  return (
    <div className={styles.container}>
      <p className={styles.summary}>
        {dataset?.configuration?.function === 'AVG' && (
          <span>{upperFirst(t('common.average'))} </span>
        )}
        <strong>{title}</strong> {unit && <span>({unit})</span>}{' '}
        {isDynamic && (
          <Fragment>
            {t('common.between')} <strong>{formatI18nDate(start)}</strong> {t('common.and')}{' '}
            <strong>{formatI18nDate(end)}</strong>
          </Fragment>
        )}
      </p>
      <ReportSummaryTags key={dataview.id} dataview={dataview} />
      {isLoading || hasError ? (
        <ReportActivityPlaceholder showHeader={false}>
          {hasError && <p className={styles.errorMessage}>{t('errors.layerLoading')}</p>}
        </ReportActivityPlaceholder>
      ) : (
        <GraphComponent start={start} end={end} data={data} />
      )}
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
}

export default ReportEnvironmentGraph

import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { DataviewType } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  isEnvironmentalDataview,
  isHeatmapVectorsDataview,
} from '@globalfishingwatch/dataviews-client'
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
  useReportTimeSeriesErrors,
  useTimeseriesStats,
} from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/reports/shared/placeholders/ReportStatsPlaceholder'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import ReportVectorGraphTooltip from 'features/reports/tabs/environment/ReportVectorGraphTooltip'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import OutOfTimerangeDisclaimer from 'features/workspace/shared/OutOfBoundsDisclaimer'
import { htmlSafeParse } from 'utils/html-parser'
import { upperFirst } from 'utils/info'

import styles from './ReportEnvironment.module.css'

function ReportEnvironmentGraph({
  GraphComponent,
  dataview,
  data,
  index = 0,
  isLoading = false,
  removeEmptyValues = false,
}: {
  GraphComponent: React.ComponentType<any>
  dataview: UrlDataviewInstance<DataviewType>
  data: ReportGraphProps | ReportGraphProps[]
  isLoading?: boolean
  index?: number
  removeEmptyValues?: boolean
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

  const timeseries = Array.isArray(data) ? data[0]?.timeseries : data?.timeseries
  const isEmptyData =
    data !== undefined && (!timeseries || (Array.isArray(timeseries) && timeseries.length === 0))
  const isHeatmapVector = isHeatmapVectorsDataview(dataview)
  const { function: aggregationFunction } = getDatasetConfiguration(dataset, 'fourwingsV1')
  return (
    <div className={styles.container}>
      <p className={styles.summary}>
        {aggregationFunction === 'AVG' && <span>{upperFirst(t((t) => t.common.average))} </span>}
        <strong>{title}</strong> {unit && <span>({unit})</span>}{' '}
        {isDynamic && (
          <Fragment>
            {t((t) => t.common.between)} <strong>{formatI18nDate(start)}</strong>{' '}
            {t((t) => t.common.and)} <strong>{formatI18nDate(end)}</strong>
          </Fragment>
        )}
        <ReportSummaryTags key={dataview.id} dataview={dataview} />
      </p>
      {(isDynamic || isHeatmapVector) &&
        (isLoading || hasError ? (
          <ReportActivityPlaceholder showHeader={false} loading={isLoading}>
            {hasError && <p className={styles.errorMessage}>{t((t) => t.errors.layerLoading)}</p>}
          </ReportActivityPlaceholder>
        ) : isEmptyData ? (
          <ReportActivityPlaceholder showHeader={false}>
            <div className={styles.noDataDisclaimer}>
              <OutOfTimerangeDisclaimer dataview={dataview} />
              {t((t) => t.analysis.noDataByArea)}
            </div>
          </ReportActivityPlaceholder>
        ) : (
          <GraphComponent
            start={start}
            end={end}
            data={data}
            removeEmptyValues={removeEmptyValues}
            // TODO: currents and winds
            // Refactor the ReportVectorGraphTooltip component and pass it here
            // before it was using the entire timeline but we want to use only the data from the hovered date
            // freezeTooltipOnClick={isHeatmapVector}
            TooltipContent={
              isHeatmapVector ? (
                <ReportVectorGraphTooltip instanceId={dataview.id} color={dataview.config?.color} />
              ) : undefined
            }
          />
        ))}
      {isLoading ? (
        <ReportStatsPlaceholder />
      ) : min !== undefined && mean !== undefined && max !== undefined ? (
        <p className={cx(styles.disclaimer, { [styles.marginTop]: isDynamic })}>
          {isDynamic
            ? t((t) => t.analysis.statsDisclaimerDynamic, {
                interval: t((t: any) => t.common[interval.toLowerCase() + 's'], {
                  count: 1,
                }).toLowerCase(),

                min: formatI18nNumber(min, { maximumFractionDigits: 2 }),
                max: formatI18nNumber(max, { maximumFractionDigits: 2 }),
                unit,
              })
            : t((t) => t.analysis.statsDisclaimerStatic, {
                min: formatI18nNumber(min, { maximumFractionDigits: 2 }),
                max: formatI18nNumber(max, { maximumFractionDigits: 2 }),
                mean: formatI18nNumber(mean, { maximumFractionDigits: 2 }),
                unit,
              })}{' '}
          {dataset?.source && (
            <span>
              {t((t) => t.analysis.dataSource)}: {htmlSafeParse(dataset.source)}
            </span>
          )}
        </p>
      ) : null}
    </div>
  )
}

export default ReportEnvironmentGraph

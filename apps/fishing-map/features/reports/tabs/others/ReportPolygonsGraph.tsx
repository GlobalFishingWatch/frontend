import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { getFiltersInDataview } from 'features/dataviews/dataviews.filters'
import { dataviewHasUserTimeRange } from 'features/dataviews/dataviews.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { useTimeseriesStats } from 'features/reports/reports-timeseries.hooks'
import { getStatsValue } from 'features/reports/reports-timeseries-shared.utils'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/reports/shared/placeholders/ReportStatsPlaceholder'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import { showSchemaFilter } from 'features/workspace/shared/LayerSchemaFilter'

import ReportPolygonsEvolution from './ReportPolygonsEvolution'

import styles from './ReportPolygonsGraph.module.css'

function ReportPolygonsGraph({
  dataview,
  dataviews,
  statsId,
  data,
  loading,
  start,
  end,
  className,
}: {
  dataview: UrlDataviewInstance
  dataviews?: UrlDataviewInstance[]
  statsId?: string
  data?: ReportGraphProps
  loading: boolean
  start: string
  end: string
  className?: string
}) {
  const { t } = useTranslation()
  const timeseriesStats = useTimeseriesStats()
  const tags = dataviews ?? [dataview]

  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.UserContext || d.type === DatasetTypes.Context
  )
  const title = getDatasetNameTranslated(dataset)
  const unit =
    dataset?.unit && dataset.unit !== 'TBD' && dataset.unit !== 'NA' ? dataset.unit : undefined

  const layerStats = timeseriesStats?.[statsId ?? dataview.id]
  const containedCount = layerStats ? getStatsValue(layerStats, 'contained') : 0
  const overlappingCount = layerStats ? getStatsValue(layerStats, 'overlapping') : 0
  const areaCoverageRatio = layerStats ? getStatsValue(layerStats, 'areaCoverageRatio') : undefined
  const areaCoverageKm2 = layerStats ? getStatsValue(layerStats, 'areaCoverageKm2') : undefined

  const { filtersAllowed } = getFiltersInDataview(dataview)
  const hasFilters = filtersAllowed.some(showSchemaFilter)
  const showEvolution = dataviewHasUserTimeRange(dataview)

  return (
    <div className={cx('card', styles.container, className)}>
      <p className={styles.title}>
        {tags.length === 1 && <ReportSummaryTags dataview={tags[0]} showFilters={false} />}
        <span>
          <strong>{title}</strong> {unit && <span>({unit})</span>}
        </span>
      </p>
      {loading || !layerStats ? (
        <ReportStatsPlaceholder />
      ) : containedCount || overlappingCount ? (
        <p className={styles.summary}>
          {containedCount !== 0 && (
            <Fragment>
              <strong>
                {containedCount} {t((t) => t.analysis.polygonsFullyContained)}
              </strong>{' '}
            </Fragment>
          )}
          {overlappingCount !== 0 && (
            <Fragment>
              {t((t) => t.common.and)}{' '}
              <strong>
                {overlappingCount} {t((t) => t.analysis.polygonsOverlapping)}
              </strong>
            </Fragment>
          )}{' '}
          {t((t) => t.analysis.polygons, {
            count: (containedCount || 0) + (overlappingCount || 0),
          })}
          {', '}
          {t((t) => t.analysis.polygonsAreaCoverage, {
            areakm2: formatI18nNumber(areaCoverageKm2 as number, {
              maximumFractionDigits: 1,
            }).toString(),
            coverage: formatI18nNumber((areaCoverageRatio as number) * 100, {
              maximumFractionDigits: 3,
            }).toString(),
          })}
        </p>
      ) : (
        <p className={styles.summary}>{t((t) => t.analysis.noPolygonsContainedOrOverlapping)}</p>
      )}

      {hasFilters && (
        <div className={styles.tagsContainer}>
          <ReportSummaryTags dataview={tags[0]} showColor={tags.length !== 1} />
        </div>
      )}
      {showEvolution &&
        (loading ? (
          <ReportActivityPlaceholder showHeader={false} loading />
        ) : (
          <ReportPolygonsEvolution start={start} end={end} data={data} />
        ))}
    </div>
  )
}

export default ReportPolygonsGraph

import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { ContextLayer, ContextPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { getFiltersInDataview } from 'features/_map/dataviews/dataviews.filters'
import { dataviewHasUserTimeRange } from 'features/_map/dataviews/dataviews.utils'
import ContextLayerReportLink from 'features/_map/map/popups/context/ContextLayerReportLink'
import { useContextInteractions } from 'features/_map/map/popups/context/ContextLayers.hooks'
import { showSchemaFilter } from 'features/_map/workspace/shared/LayerSchemaFilter.utils'
import type { ReportGraphProps } from 'features/_reports/reports-timeseries.hooks'
import { useTimeseriesStats } from 'features/_reports/reports-timeseries.hooks'
import { getStatsValue } from 'features/_reports/reports-timeseries-shared.utils'
import ReportActivityPlaceholder from 'features/_reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/_reports/shared/placeholders/ReportStatsPlaceholder'
import ReportSummaryTags from 'features/_reports/shared/summary/ReportSummaryTags'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'

import ReportPolygonsEvolution from './ReportPolygonsEvolution'
import ReportSublayerValues from './ReportSublayerValues'

import styles from './ReportPolygonsGraph.module.css'

function formatArea(km2: number) {
  return km2 < 1
    ? `${formatI18nNumber(km2 * 1_000_000, { maximumFractionDigits: 0 })} m²`
    : `${formatI18nNumber(km2, { maximumFractionDigits: 0 })} km²`
}

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
  const contextLayer = useGetDeckLayer<ContextLayer>(statsId ?? dataview.id)
  const { onReportClick } = useContextInteractions()

  // getPickedFeatureToHighlight matches on id alone, so no need to keep the geometry around
  const highlightArea = useCallback(
    (id?: string) => {
      contextLayer?.instance?.setHighlightedFeatures(
        id ? [{ id } as ContextPickingObject] : ([] as ContextPickingObject[])
      )
    },
    [contextLayer]
  )

  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.UserContext || d.type === DatasetTypes.Context
  )
  const title = dataset?.name
  const unit =
    dataset?.unit && dataset.unit !== 'TBD' && dataset.unit !== 'NA' ? dataset.unit : undefined

  const layerStats = timeseriesStats?.[statsId ?? dataview.id]
  const containedCount = layerStats ? getStatsValue(layerStats, 'contained') : 0
  const overlappingCount = layerStats ? getStatsValue(layerStats, 'overlapping') : 0
  const containedValues = layerStats
    ? (getStatsValue(layerStats, 'containedValues') as number[])
    : []
  const overlappingValues = layerStats
    ? (getStatsValue(layerStats, 'overlappingValues') as number[])
    : []
  const areaCoverageRatio = layerStats ? getStatsValue(layerStats, 'areaCoverageRatio') : undefined
  const areaCoverageKm2 = layerStats ? getStatsValue(layerStats, 'areaCoverageKm2') : undefined
  const topAreas = layerStats ? getStatsValue(layerStats, 'topAreas') : undefined

  const { filtersAllowed } = getFiltersInDataview(dataview)
  const hasFilters = filtersAllowed.some(showSchemaFilter)
  const showEvolution = dataviewHasUserTimeRange(dataview)

  return (
    <div className={cx('card', styles.container, className)}>
      <div className={styles.title}>
        {tags.length === 1 && <ReportSummaryTags dataview={tags[0]} showFilters={false} />}
        <span>
          <strong>{title}</strong> {unit && <span>({unit})</span>}
        </span>
      </div>
      {loading || !layerStats ? (
        <ReportStatsPlaceholder />
      ) : containedCount || overlappingCount ? (
        <p className={styles.summary}>
          {containedCount !== 0 && (
            <Fragment>
              <strong>
                {containedCount} {t((t) => t.analysis.polygonsFullyContained)}
              </strong>
              <ReportSublayerValues values={containedValues} tags={tags} />
            </Fragment>
          )}{' '}
          {containedCount !== 0 && overlappingCount !== 0 && `${t((t) => t.common.and)} `}
          {overlappingCount !== 0 && (
            <Fragment>
              <strong>
                {overlappingCount} {t((t) => t.analysis.polygonsOverlapping)}
              </strong>
              <ReportSublayerValues values={overlappingValues} tags={tags} />
            </Fragment>
          )}{' '}
          {t((t) => t.analysis.polygons, {
            count: (containedCount || 0) + (overlappingCount || 0),
          })}
          {typeof areaCoverageRatio === 'number' && typeof areaCoverageKm2 === 'number' && (
            <Fragment>
              {', '}
              {t((t) => t.analysis.polygonsAreaCoverage, {
                areakm2: formatI18nNumber(areaCoverageKm2, {
                  maximumFractionDigits: 1,
                }).toString(),
                coverage: formatI18nNumber(areaCoverageRatio * 100, {
                  maximumFractionDigits: 3,
                }).toString(),
              })}
            </Fragment>
          )}
        </p>
      ) : (
        <p className={styles.summary}>{t((t) => t.analysis.noPolygonsContainedOrOverlapping)}</p>
      )}

      {hasFilters && (
        <div className={styles.tagsContainer}>
          {tags.length > 1 && tags.map((d) => <ReportSummaryTags dataview={d} />)}
        </div>
      )}
      {showEvolution &&
        (loading ? (
          <ReportActivityPlaceholder showHeader={false} loading />
        ) : (
          <ReportPolygonsEvolution start={start} end={end} data={data} />
        ))}

      {topAreas && topAreas.length > 1 && (
        <details className={styles.topAreas}>
          <summary className={styles.topAreasTitle}>
            {t((t) => t.analysis.polygonsTopAreas, { count: topAreas.length })}
            <Icon icon="arrow-down" className={styles.topAreasChevron} />
          </summary>
          <ol>
            {topAreas.map((topArea, index) => (
              <li
                key={`${topArea.id}-${index}`}
                className={styles.topArea}
                onMouseEnter={() => highlightArea(topArea.id)}
                onMouseLeave={() => highlightArea()}
              >
                <span className={styles.topAreaLabel} title={topArea.label}>
                  {topArea.label}
                  <span className={styles.topAreaActions}>
                    <ContextLayerReportLink feature={topArea.feature} onClick={onReportClick} />
                  </span>
                </span>
                <span className={styles.topAreaValue}>{formatArea(topArea.km2)}</span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  )
}

export default ReportPolygonsGraph

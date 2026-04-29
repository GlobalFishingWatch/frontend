import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getFlattenDatasetFilters } from '@globalfishingwatch/datasets-client'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { dataviewHasUserTimeRange } from 'features/dataviews/dataviews.utils'
import { selectOthersActiveReportDataviewsGrouped } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import { isUserContextPolygonsDataviewReportSupported } from 'features/reports/report-area/area-reports.utils'
import { selectReportDatasetId } from 'features/reports/reports.selectors'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
  useTimeseriesStats,
} from 'features/reports/reports-timeseries.hooks'
import { getStatsValue } from 'features/reports/reports-timeseries-shared.utils'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/reports/shared/placeholders/ReportStatsPlaceholder'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import ReportPolygonsEvolution from 'features/reports/tabs/others/ReportPolygonsEvolution'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import styles from './ReportOthers.module.css'
import reportStyles from 'features/reports/report-area/AreaReport.module.css'

function ReportOthers() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const timeseriesLoading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const loading = timeseriesLoading || layersTimeseriesFiltered?.some((d) => d?.mode === 'loading')
  const timeseriesStats = useTimeseriesStats()
  const reportDatasetId = useSelector(selectReportDatasetId)
  const otherDataviewsGrouped = useSelector(selectOthersActiveReportDataviewsGrouped)
  const otherDataviews = Object.fromEntries(
    Object.entries(otherDataviewsGrouped).filter(([, dataviews]) =>
      dataviews.every((d) => !d.datasets?.some((ds) => reportDatasetId?.split(',').includes(ds.id)))
    )
  )
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  if (!Object.keys(otherDataviews)?.length) return null

  return (
    <div className={reportStyles.section}>
      {Object.values(otherDataviews).map((dataviews) => {
        const dataview = dataviews[0]
        const dataset = dataview.datasets?.find(
          (d) => d.type === DatasetTypes.UserContext || d.type === DatasetTypes.Context
        )

        const selectOptions = getFlattenDatasetFilters(dataset?.filters)
          .filter((f) => f.type === 'range' || f.type === 'number')
          .map((f) => ({ id: f.id, label: f.id }))
        const onSelectAggregatedProperty = (option: SelectOption) => {
          const newDataviewConfig = {
            aggregateByProperty: option.id.toString(),
          }
          const newDataview = { id: dataview.id, config: newDataviewConfig }
          upsertDataviewInstance(newDataview)
        }

        const onClearSelection = () => {
          const newDataviewConfig = {
            aggregateByProperty: undefined,
          }
          const newDataview = { id: dataview.id, config: newDataviewConfig }
          upsertDataviewInstance(newDataview)
        }

        const selectedProperty = selectOptions.find(
          (option) => option.id === dataview.config?.aggregateByProperty
        )
        const hasAggregateByProperty = Boolean(dataview.config?.aggregateByProperty)

        const isPolygonsDataview = isUserContextPolygonsDataviewReportSupported(dataview)
        const mergedDataviewId = getMergedDataviewId(dataviews)

        const layerTimeseries = layersTimeseriesFiltered?.find((ts) => ts.id === mergedDataviewId)
        const layerTimeseriesWithCurrentColors = layerTimeseries
          ? {
              ...layerTimeseries,
              sublayers: layerTimeseries.sublayers.map((sublayer, i) => ({
                ...sublayer,
                legend: {
                  ...sublayer.legend,
                  color: dataviews[i]?.config?.color || sublayer.legend.color,
                },
              })),
            }
          : undefined
        const hasTimeFilter = dataviewHasUserTimeRange(dataview)
        const title = getDatasetNameTranslated(dataset)
        const unit =
          dataset?.unit && dataset.unit !== 'TBD' && dataset.unit !== 'NA'
            ? dataset.unit
            : undefined

        const layerStats = timeseriesStats?.[mergedDataviewId]

        // polygons
        const containedCount = layerStats ? getStatsValue(layerStats, 'contained') : 0
        const overlappingCount = layerStats ? getStatsValue(layerStats, 'overlapping') : 0
        const areaCoverageRatio = layerStats
          ? getStatsValue(layerStats, 'areaCoverageRatio')
          : undefined
        const areaCoverageKm2 = layerStats
          ? getStatsValue(layerStats, 'areaCoverageKm2')
          : undefined

        // points
        const totalValue = layerStats ? getStatsValue(layerStats, 'total') : undefined
        const statsValues = layerStats ? getStatsValue(layerStats, 'values') : undefined
        const statsCounts = layerStats ? getStatsValue(layerStats, 'count') : undefined

        const PolygonsStatsComponent =
          containedCount || overlappingCount ? (
            <p className={cx(styles.summary)}>
              {containedCount !== 0 && (
                <Fragment>
                  <strong>{containedCount}</strong> {t((t) => t.analysis.polygonsFullyContained)}{' '}
                  {t((t) => t.common.and)}{' '}
                </Fragment>
              )}
              {overlappingCount !== 0 && (
                <Fragment>
                  <strong>{overlappingCount}</strong> {t((t) => t.analysis.polygonsOverlapping)}
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
          ) : null

        const PointsStatsComponent =
          totalValue !== undefined ? (
            <p className={cx(styles.summary)}>
              <Fragment>
                <span>
                  <strong>
                    {statsCounts}
                    {' ' +
                      t((t) => t.common.points, {
                        count: statsCounts,
                      })}
                  </strong>
                  {hasAggregateByProperty &&
                    ' ' +
                      t((t) => t.common.aggregatedBy, {
                        total: formatI18nNumber(totalValue as number),
                        property: dataview.config?.aggregateByProperty,
                      })}{' '}
                  {t((t) => t.analysis.insideYourArea)}
                  {hasTimeFilter && (
                    <>
                      {' '}
                      {t((t) => t.common.between)} <strong>{formatI18nDate(start)}</strong>{' '}
                      {t((t) => t.common.and)} <strong>{formatI18nDate(end)}</strong>
                    </>
                  )}
                </span>
                {statsValues && (statsValues as number[])?.length > 1 && (
                  <Fragment>
                    (
                    {(statsValues as number[]).map((value, index) => (
                      <Fragment key={index}>
                        <span
                          className={styles.dot}
                          style={{ color: dataviews[index]?.config?.color }}
                        ></span>
                        {value}
                        {index < (statsValues as number[]).length - 1 ? ', ' : ''}
                      </Fragment>
                    ))}
                    ){' '}
                  </Fragment>
                )}
              </Fragment>
            </p>
          ) : null

        const StatsComponent = isPolygonsDataview ? PolygonsStatsComponent : PointsStatsComponent

        return (
          <div key={mergedDataviewId} className={cx('card', styles.subsection)}>
            <h2 className={styles.title}>
              <strong>{title}</strong> {unit && <span>({unit})</span>}
            </h2>
            {hasTimeFilter && loading ? <ReportStatsPlaceholder /> : StatsComponent}
            {dataviews?.length > 0 && (
              <div className={styles.selectContainer}>
                <div className={styles.tagsContainer}>
                  {dataviews?.map((d) => (
                    <ReportSummaryTags key={d.id} dataview={d} />
                  ))}
                </div>
                {!isPolygonsDataview &&
                  (selectedProperty || (selectOptions.length > 0 && statsCounts !== 0)) && (
                    <Select
                      options={selectOptions}
                      selectedOption={selectedProperty}
                      onSelect={onSelectAggregatedProperty}
                      placeholder={t((t) => t.analysis.selectAggregationProperty)}
                      onCleanClick={onClearSelection}
                    />
                  )}
              </div>
            )}
            {hasTimeFilter &&
              (loading ? (
                <ReportActivityPlaceholder showHeader={false} loading />
              ) : isPolygonsDataview ? (
                <ReportPolygonsEvolution
                  start={start}
                  end={end}
                  data={layerTimeseriesWithCurrentColors}
                />
              ) : statsCounts === 0 ? (
                <ReportActivityPlaceholder showHeader={false}>
                  {t((t) => t.analysis.noDataByArea)}
                </ReportActivityPlaceholder>
              ) : (
                <ReportActivityEvolution
                  start={start}
                  end={end}
                  data={layerTimeseriesWithCurrentColors}
                />
              ))}
          </div>
        )
      })}
    </div>
  )
}

export default ReportOthers

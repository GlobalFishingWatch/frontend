import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getFlattenDatasetFilters } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { getFiltersInDataview } from 'features/dataviews/dataviews.filters'
import { dataviewHasUserTimeRange } from 'features/dataviews/dataviews.utils'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import type { ReportGraphProps } from 'features/reports/reports-timeseries.hooks'
import { useTimeseriesStats } from 'features/reports/reports-timeseries.hooks'
import { getStatsValue } from 'features/reports/reports-timeseries-shared.utils'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/reports/shared/placeholders/ReportStatsPlaceholder'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import { showSchemaFilter } from 'features/workspace/shared/LayerSchemaFilter.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import ReportSublayerValues from './ReportSublayerValues'

import styles from './ReportPointsGraph.module.css'

function ReportPointsGraph({
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
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const tags = dataviews ?? [dataview]

  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.UserContext || d.type === DatasetTypes.Context
  )
  const title = dataset?.name
  const unit =
    dataset?.unit && dataset.unit !== 'TBD' && dataset.unit !== 'NA' ? dataset.unit : undefined
  const hasTimeFilter = dataviewHasUserTimeRange(dataview)

  const selectOptions = getFlattenDatasetFilters(dataset?.filters)
    .filter((f) => f.type === 'range' || f.type === 'number')
    .map((f) => ({ id: f.id, label: f.id }))

  const onSelectAggregatedProperty = (option: SelectOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: { aggregateByProperty: option.id.toString() },
    })
  }
  const onClearSelection = () => {
    upsertDataviewInstance({ id: dataview.id, config: { aggregateByProperty: undefined } })
  }

  const selectedProperty = selectOptions.find(
    (option) => option.id === dataview.config?.aggregateByProperty
  )
  const hasAggregateByProperty = Boolean(dataview.config?.aggregateByProperty)

  const { filtersAllowed } = getFiltersInDataview(dataview)
  const hasFilters = filtersAllowed.some(showSchemaFilter)
  const singleDataview = tags.length === 1

  const layerStats = timeseriesStats?.[statsId ?? dataview.id]
  const totalValue = layerStats ? getStatsValue(layerStats, 'total') : undefined
  const statsValues = layerStats ? getStatsValue(layerStats, 'values') : undefined
  const statsCounts = layerStats ? getStatsValue(layerStats, 'count') : undefined

  const StatsComponent =
    totalValue !== undefined ? (
      <p className={styles.summary}>
        <Fragment>
          <span>
            <strong>
              {statsCounts}
              {' ' + t((t) => t.common.points, { count: statsCounts })}
            </strong>
            {hasAggregateByProperty &&
              ' ' +
                t((t) => t.common.aggregatedBy, {
                  total: formatI18nNumber(totalValue as number) as string,
                  property: dataview.config?.aggregateByProperty ?? '',
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
          {statsValues && <ReportSublayerValues values={statsValues as number[]} tags={tags} />}
        </Fragment>
      </p>
    ) : null

  return (
    <div className={cx('card', className)}>
      <h2 className={styles.title}>
        {singleDataview && <ReportSummaryTags dataview={dataview} showFilters={false} />}
        <span>
          <strong>{title}</strong> {unit && <span>({unit})</span>}
        </span>
      </h2>
      {hasTimeFilter && loading ? <ReportStatsPlaceholder /> : StatsComponent}
      {tags.length > 0 && (
        <div className={styles.selectContainer}>
          <div className={styles.tagsContainer}>
            {singleDataview
              ? hasFilters && <ReportSummaryTags dataview={dataview} showColor={false} />
              : tags.map((d) => <ReportSummaryTags key={d.id} dataview={d} />)}
          </div>
          {(selectedProperty || (selectOptions.length > 0 && statsCounts !== 0)) && (
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
        ) : statsCounts === 0 ? (
          <ReportActivityPlaceholder showHeader={false}>
            {t((t) => t.analysis.noDataByArea)}
          </ReportActivityPlaceholder>
        ) : (
          <ReportActivityEvolution start={start} end={end} data={data} />
        ))}
    </div>
  )
}

export default ReportPointsGraph

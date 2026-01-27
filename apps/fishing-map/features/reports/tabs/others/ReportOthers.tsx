import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { dataviewHasUserPointsTimeRange } from 'features/dataviews/dataviews.utils'
import { selectPointsActiveReportDataviewsGrouped } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
  useTimeseriesStats,
} from 'features/reports/reports-timeseries.hooks'
import { getStatsValue } from 'features/reports/reports-timeseries-shared.utils'
import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportStatsPlaceholder from 'features/reports/shared/placeholders/ReportStatsPlaceholder'
import { useGetHasDataviewSchemaFilters } from 'features/reports/shared/summary/report-summary.hooks'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import styles from './ReportOthers.module.css'
import summaryStyles from 'features/reports/shared/summary/ReportSummary.module.css'

function ReportOthers() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const timeseriesLoading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const loading = timeseriesLoading || layersTimeseriesFiltered?.some((d) => d?.mode === 'loading')
  const getHasDataviewSchemaFilters = useGetHasDataviewSchemaFilters()
  const timeseriesStats = useTimeseriesStats()
  const otherDataviews = useSelector(selectPointsActiveReportDataviewsGrouped)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  if (!Object.keys(otherDataviews)?.length) return null

  return (
    <Fragment>
      {Object.values(otherDataviews).map((dataviews, index) => {
        const dataview = dataviews[0]
        const dataset = dataview.datasets?.find(
          (d) => d.type === DatasetTypes.UserContext || d.type === DatasetTypes.Context
        )

        const selectOptions = dataset?.schema
          ? Object.entries(dataset.schema)
              .filter(([, filter]) => filter.type === 'range' || filter.type === 'number')
              .map(([key]) => ({ id: key, label: key }))
          : []

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

        const mergedDataviewId = getMergedDataviewId(dataviews)
        const hasTimeFilter = dataviewHasUserPointsTimeRange(dataview)
        const title = getDatasetNameTranslated(dataset)
        const unit =
          dataset?.unit && dataset.unit !== 'TBD' && dataset.unit !== 'NA'
            ? dataset.unit
            : undefined
        const totalValue = timeseriesStats?.[mergedDataviewId]
          ? getStatsValue(timeseriesStats[mergedDataviewId], 'total')
          : undefined
        const statsValues = timeseriesStats?.[mergedDataviewId]
          ? getStatsValue(timeseriesStats[mergedDataviewId], 'values')
          : undefined
        const statsCounts = timeseriesStats?.[mergedDataviewId]
          ? getStatsValue(timeseriesStats[mergedDataviewId], 'count')
          : undefined
        const hasDataviewSchemaFilters = dataviews.some((d) => getHasDataviewSchemaFilters(d))

        const StatsComponent =
          totalValue !== undefined ? (
            <p className={cx(styles.summary)}>
              <Fragment>
                <span>
                  {statsCounts}
                  {' ' +
                    t((t) => t.common.points, {
                      count: statsCounts,
                    })}
                  {hasAggregateByProperty &&
                    ' ' +
                      t((t) => t.common.aggregatedBy, {
                        total: formatI18nNumber(totalValue),
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
                {statsValues && statsValues?.length > 1 && (
                  <Fragment>
                    (
                    {statsValues.map((value, index) => (
                      <Fragment key={index}>
                        <span
                          className={styles.dot}
                          style={{ color: dataviews[index]?.config?.color }}
                        ></span>
                        {value}
                        {index < statsValues.length - 1 ? ', ' : ''}
                      </Fragment>
                    ))}
                    ){' '}
                  </Fragment>
                )}
              </Fragment>
            </p>
          ) : null

        return (
          <div key={mergedDataviewId} className={styles.container}>
            <h2 className={styles.title}>{title}</h2> {unit && <span>({unit})</span>}
            {hasTimeFilter && loading ? <ReportStatsPlaceholder /> : StatsComponent}
            {dataviews?.length > 0 && (
              <div className={styles.selectContainer}>
                <div
                  className={cx(summaryStyles.tagsContainer, {
                    [summaryStyles.tagsContainerNoFilters]: !hasDataviewSchemaFilters,
                  })}
                >
                  {dataviews?.map((d) => (
                    <ReportSummaryTags key={d.id} dataview={d} />
                  ))}
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
                <ReportActivityEvolution
                  start={start}
                  end={end}
                  data={layersTimeseriesFiltered?.[index]}
                />
              ))}
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportOthers

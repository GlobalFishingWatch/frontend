import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import htmlParse from 'html-react-parser'

import { DatasetTypes, DataviewType } from '@globalfishingwatch/api-types'
import { getAvailableIntervalsInDataviews } from '@globalfishingwatch/deck-layer-composer'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { selectOthersActiveReportDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
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
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import ReportCurrentsGraph from 'features/reports/tabs/activity/ReportCurrentsGraph'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { upperFirst } from 'utils/info'

import styles from './ReportOthers.module.css'

function ReportOthers() {
  useComputeReportTimeSeries()
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  console.log('🚀 ~ ReportOthers ~ layersTimeseriesFiltered:', layersTimeseriesFiltered)
  const otherDataviews = useSelector(selectOthersActiveReportDataviews)
  // const allAvailableIntervals = getAvailableIntervalsInDataviews(otherDataviews)
  // const interval = getFourwingsInterval(start, end, allAvailableIntervals)

  if (!otherDataviews?.length) return null

  return (
    <Fragment>
      {otherDataviews.map((dataview, index) => {
        const isDynamic = dataview.config?.type === DataviewType.HeatmapAnimated
        const isCurrents = dataview.config?.type === DataviewType.Currents
        const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.UserContext)
        const title = getDatasetNameTranslated(dataset)
        const unit = dataset?.unit && dataset.unit !== 'TBD' ? dataset.unit : undefined

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
            <ReportActivityEvolution
              start={start}
              end={end}
              data={layersTimeseriesFiltered?.[index]}
            />
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportOthers

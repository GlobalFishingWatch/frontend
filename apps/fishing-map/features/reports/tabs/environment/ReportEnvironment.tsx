import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import {
  isEnvironmentalDataview,
  isHeatmapVectorsDataview,
} from '@globalfishingwatch/dataviews-client'
import { trackEvent } from '@globalfishingwatch/react-hooks'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReportComparisonDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import { categoryToDataviewMap, ReportCategory } from 'features/reports/reports.types'
import {
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/reports/reports-timeseries.hooks'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'

import ReportActivityDatasetComparison from '../activity/ReportActivityDatasetComparison'
import ReportActivityDatasetComparisonGraph from '../activity/ReportActivityDatasetComparisonGraph'

import ReportEnvironmentGraph from './ReportEnvironmentGraph'
import ReportEnvironmentGraphSelector from './ReportEnvironmentGraphSelector'

import styles from './ReportEnvironment.module.css'

function ReportEnvironment() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const loading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const comparisonDataviews = useSelector(selectReportComparisonDataviews)
  const environmentalDataviews = useSelector(selectActiveReportDataviews)
  const reportGraphType = useSelector(selectReportActivityGraph)

  const onAddLayerClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Open panel to add a report layer`,
    })

    const open = categoryToDataviewMap[ReportCategory.Environment]
    if (open) {
      dispatch(setModalOpen({ id: 'layerLibrary', open, singleCategory: true }))
    }
  }, [dispatch])

  if (!environmentalDataviews?.length && !comparisonDataviews?.length) return null

  return (
    <div className={styles.graphContainer}>
      {environmentalDataviews.some(
        (dv) => isEnvironmentalDataview(dv) || isHeatmapVectorsDataview(dv)
      ) ? (
        <ReportEnvironmentGraphSelector />
      ) : null}
      <div className={cx(styles.titleRow, styles.marginTop)}>
        <h2 className={styles.graphTitle}>{t('layer.add')}</h2>
        <IconButton
          icon="plus"
          type="border"
          size="small"
          tooltip={t('layer.add')}
          tooltipPlacement="top"
          onClick={onAddLayerClick}
        />
      </div>
      <div>
        {reportGraphType === 'evolution' ? (
          environmentalDataviews.map((dataview, index) => {
            return (
              <ReportEnvironmentGraph
                key={dataview.id}
                dataview={dataview}
                GraphComponent={ReportActivityEvolution}
                data={layersTimeseriesFiltered?.[index]}
                isLoading={loading || layersTimeseriesFiltered?.[index]?.mode === 'loading'}
                index={index}
              />
            )
          })
        ) : (
          <div className={styles.graphContainer}>
            <ReportActivityDatasetComparison />
            <ReportEnvironmentGraph
              dataview={comparisonDataviews[0]}
              GraphComponent={ReportActivityDatasetComparisonGraph}
              data={layersTimeseriesFiltered}
              isLoading={loading || layersTimeseriesFiltered?.some((d) => d?.mode === 'loading')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportEnvironment

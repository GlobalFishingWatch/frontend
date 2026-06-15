import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import {
  isEnvironmentalDataview,
  isHeatmapVectorsDataview,
} from '@globalfishingwatch/dataviews-client'
import { trackEvent } from '@globalfishingwatch/react-hooks'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import { TrackCategory } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReportComparisonDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { isPolygonsDataviewReportSupported } from 'features/reports/report-area/area-reports.utils'
import { REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON } from 'features/reports/reports.config'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import { categoryToDataviewMap, ReportCategory } from 'features/reports/reports.types'
import {
  useComputeReportTimeSeries,
  useReportFeaturesLoading,
  useReportFilteredTimeSeries,
} from 'features/reports/reports-timeseries.hooks'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'
import ReportPolygonsGraph from 'features/reports/tabs/others/ReportPolygonsGraph'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import ReportActivityDatasetComparison from '../activity/ReportActivityDatasetComparison'
import ReportActivityDatasetComparisonGraph from '../activity/ReportActivityDatasetComparisonGraph'

import ReportEnvironmentMigramar from './migramar/ReportEnvironmentMigramar'
import ReportEnvironmentGraph from './ReportEnvironmentGraph'
import ReportEnvironmentGraphSelector from './ReportEnvironmentGraphSelector'

import styles from './ReportEnvironment.module.css'

function ReportEnvironment() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  useComputeReportTimeSeries()

  const { start, end } = useTimerangeConnect()
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
    <div className={styles.section}>
      {environmentalDataviews.some(
        (dv) => isEnvironmentalDataview(dv) || isHeatmapVectorsDataview(dv)
      ) ? (
        <ReportEnvironmentGraphSelector />
      ) : null}
      <div>
        {reportGraphType !== REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON ? (
          <>
            {environmentalDataviews.map((dataview, index) => {
              if (isPolygonsDataviewReportSupported(dataview)) {
                return (
                  <ReportPolygonsGraph
                    key={dataview.id}
                    dataview={dataview}
                    data={layersTimeseriesFiltered?.[index]}
                    loading={loading}
                    start={start}
                    end={end}
                  />
                )
              }
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
            })}
            {/* TODO:Migramar show this instead of ReportEnvironmentGraph when dataview is migramar */}
            <ReportEnvironmentMigramar dataview={environmentalDataviews[0]} />
          </>
        ) : (
          <Fragment>
            <div className={styles.comparisonContainer}>
              <ReportActivityDatasetComparison />
            </div>
            <div className={styles.graphContainer}>
              <ReportEnvironmentGraph
                dataview={comparisonDataviews[0]}
                GraphComponent={ReportActivityDatasetComparisonGraph}
                data={layersTimeseriesFiltered}
                isLoading={loading || layersTimeseriesFiltered?.some((d) => d?.mode === 'loading')}
              />
            </div>
          </Fragment>
        )}
      </div>
      {reportGraphType === 'evolution' && (
        <div className={cx(styles.addLayerContainer)}>
          <Button type="border-secondary" size="medium" onClick={onAddLayerClick}>
            <Icon icon="plus" />
            {t((t) => t.layer.add)}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReportEnvironment

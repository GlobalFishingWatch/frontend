import { useSelector } from 'react-redux'

import {
  isEnvironmentalDataview,
  isHeatmapVectorsDataview,
} from '@globalfishingwatch/dataviews-client'

import { selectReportComparisonDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
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
  const loading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const comparisonDataviews = useSelector(selectReportComparisonDataviews)
  const environmentalDataviews = useSelector(selectActiveReportDataviews)
  const reportGraphType = useSelector(selectReportActivityGraph)

  if (!environmentalDataviews?.length && !comparisonDataviews?.length) return null

  return (
    <div className={styles.graphContainer}>
      {environmentalDataviews.every(
        (dv) => isHeatmapVectorsDataview(dv) || !isEnvironmentalDataview(dv)
      ) ? null : (
        <ReportEnvironmentGraphSelector />
      )}
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

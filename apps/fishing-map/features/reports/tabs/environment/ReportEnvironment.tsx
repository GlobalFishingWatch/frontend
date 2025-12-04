import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectReportComparisonDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import {
  useReportFeaturesLoading,
  // useReportFilteredFeatures,
  useReportFilteredTimeSeries,
} from 'features/reports/reports-timeseries.hooks'
import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'

// import ReportVectorGraphTooltip from 'features/reports/tabs/activity/ReportVectorGraphTooltip'
import ReportActivityDatasetComparison from '../activity/ReportActivityDatasetComparison'
import ReportActivityDatasetComparisonGraph from '../activity/ReportActivityDatasetComparisonGraph'

import ReportEnvironmentGraph from './ReportEnvironmentGraph'
import ReportEnvironmentGraphSelector from './ReportEnvironmentGraphSelector'

import styles from './ReportEnvironment.module.css'

function ReportEnvironment() {
  const { t } = useTranslation()
  const loading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const comparisonDataviews = useSelector(selectReportComparisonDataviews)
  // const layersFilteredFeatures = useReportFilteredFeatures()
  // const timeseriesStats = useTimeseriesStats()
  const environmentalDataviews = useSelector(selectActiveReportDataviews)
  const reportGraphType = useSelector(selectReportActivityGraph)

  if (!environmentalDataviews?.length && !comparisonDataviews?.length) return null

  // const isCurrents = isHeatmapCurrentsDataview(environmentalDataviews)

  return (
    <div className={styles.graphContainer}>
      <ReportEnvironmentGraphSelector />
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

        {/* {isCurrents && layersFilteredFeatures?.[0] ? (
          <Fragment>
            <ReportCurrentsGraph
              color={environmentalDataviews[0].config?.color}
              data={layersFilteredFeatures?.[0]}
            />
            // TODO: add this graph when we calculate the currents timeseries properly
             <ReportActivityEvolution
                  start={timerange.start}
                  end={timerange.end}
                  data={layersTimeseriesFiltered?.[0]}
                />
          </Fragment>
        ) : null} */}
      </div>
    </div>
  )
}

export default ReportEnvironment

import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'
import AnalysisEvolutionGraph from 'features/analysis/AnalysisEvolutionGraph'
import { useTimerange } from 'features/timebar/timebar.hooks'
import { useFilteredTimeSeries } from 'features/analysis/analysis.hooks'
import { useAnalysisArea } from 'features/analysis/analysis.area.hooks'
import styles from './Analysis.module.css'

const Analysis = () => {
  const router = useRouter()
  const { layerId, areaId, ...rest } = router.query
  const { areaName, areaFeature } = useAnalysisArea()
  const layersTimeseries = useFilteredTimeSeries(areaFeature)
  const { layersTimeseriesFiltered, loading } = layersTimeseries
  const [{ start, end }] = useTimerange()

  return (
    <div className={cx('scrollContainer', styles.container)}>
      <div className={styles.header}>
        <h2>Analysis {areaName ? `- ${areaName}` : ''}</h2>
        <Link
          href={{
            pathname: '/',
            query: rest,
          }}
        >
          <IconButton icon="close" />
        </Link>
      </div>
      {layersTimeseriesFiltered?.length > 0 && (
        <ul className={styles.graphsContainer}>
          {layersTimeseriesFiltered.map((layerGraph) => {
            return (
              <li>
                <label>{layerGraph.layer.id}</label>
                {loading ? (
                  <Spinner />
                ) : (
                  <AnalysisEvolutionGraph
                    key={layerGraph.layer.id}
                    start={start}
                    end={end}
                    graphData={layerGraph}
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Analysis

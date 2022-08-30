import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'
import AnalysisEvolutionGraph from 'features/analysis/AnalysisEvolutionGraph'
import { useTimerange } from 'features/timebar/timebar.hooks'
import { useFilteredTimeSeries } from 'features/analysis/analysis.hooks'
import { useAnalysisArea } from 'features/analysis/analysis.area.hooks'
import { useGeoTemporalLayers } from 'features/layers/layers.hooks'
import styles from './Analysis.module.css'

const Analysis = () => {
  const router = useRouter()
  const { layerId, areaId, ...rest } = router.query
  const { areaName, areaFeature } = useAnalysisArea()
  const layersTimeseries = useFilteredTimeSeries(areaFeature)
  const { layersTimeseriesFiltered, loading } = layersTimeseries
  const [{ start, end }] = useTimerange()
  const geoTemporalLayers = useGeoTemporalLayers()

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
          <IconButton icon="close" type="border" />
        </Link>
      </div>
      {layersTimeseriesFiltered?.length > 0 && (
        <ul>
          {layersTimeseriesFiltered.map((layerGraph) => {
            const layer = geoTemporalLayers.find((l) => l.id === layerGraph.layer.id)
            return (
              <li className={styles.graphContainer} key={layerGraph.layer.id}>
                <h2 className={styles.name}>
                  {layer.dataset.name}
                  <span className={styles.unit}>{layer.dataset.unit}</span>
                </h2>
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

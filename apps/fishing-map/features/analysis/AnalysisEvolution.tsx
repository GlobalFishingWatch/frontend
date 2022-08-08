import { Fragment } from 'react'
import { Spinner } from '@globalfishingwatch/ui-components'
import AnalysisRow from 'features/analysis/AnalysisRow'
import styles from './AnalysisEvolution.module.css'
import { AnalysisTypeProps } from './Analysis'

const AnalysisEvolution: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, loading, blur, analysisAreaName } = props
  if (!layersTimeseriesFiltered) {
    return (
      <div className={styles.graphContainer}>
        <Spinner />
      </div>
    )
  }
  return (
    <Fragment>
      {layersTimeseriesFiltered?.map((layerTimeseriesFiltered, index) => {
        return (
          <AnalysisRow
            type="evolution"
            key={index}
            blur={blur}
            loading={loading}
            analysisAreaName={analysisAreaName}
            graphData={layerTimeseriesFiltered}
          />
        )
      })}
    </Fragment>
  )
}

export default AnalysisEvolution

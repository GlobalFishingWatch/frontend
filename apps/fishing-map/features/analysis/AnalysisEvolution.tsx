import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import AnalysisEvolutionGraph, { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import styles from './AnalysisEvolution.module.css'
import useAnalysisDescription, { FIELDS } from './analysisDescription.hooks'
import { AnalysisTypeProps } from './Analysis'
import AnalysisDescription from './AnalysisDescription'

type AnalysisItemProps = {
  loading: boolean
  graphData: AnalysisGraphProps
  analysisAreaName: string
}
function AnalysisItem({ loading, graphData, analysisAreaName }: AnalysisItemProps) {
  const { start, end } = useTimerangeConnect()
  const dataviewsIds = useMemo(() => {
    return graphData.sublayers.map((s) => s.id)
  }, [graphData])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  const { description, commonProperties } = useAnalysisDescription(analysisAreaName, graphData)
  return (
    <div className={styles.container}>
      <Fragment>
        <AnalysisDescription description={description} />
        <div className={styles.layerPanels}>
          {dataviews?.map((dataview, index) => (
            <AnalysisLayerPanel
              key={dataview.id}
              dataview={dataview}
              index={index}
              hiddenProperties={commonProperties}
              availableFields={FIELDS}
            />
          ))}
        </div>
      </Fragment>
      {loading ||
        (!graphData && (
          <div className={styles.graphContainer}>
            <Spinner />
          </div>
        ))}
      {graphData && (
        <div className={loading ? styles.blur : ''}>
          <AnalysisEvolutionGraph graphData={graphData} start={start} end={end} />
        </div>
      )}
    </div>
  )
}

const AnalysisEvolution: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, loading, analysisAreaName } = props
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
          <AnalysisItem
            key={index}
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

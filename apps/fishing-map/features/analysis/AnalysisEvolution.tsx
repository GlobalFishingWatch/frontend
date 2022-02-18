import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
import { t } from 'features/i18n/i18n'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import AnalysisEvolutionGraph, { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import styles from './AnalysisEvolution.module.css'
import useAnalysisDescription, { FIELDS } from './analysisDescription.hooks'
import { AnalysisTypeProps } from './Analysis'
import AnalysisDescription from './AnalysisDescription'

type AnalysisItemProps = {
  blur: boolean
  loading: boolean
  graphData: AnalysisGraphProps
  analysisAreaName: string
}
function AnalysisItem({ blur, loading, graphData, analysisAreaName }: AnalysisItemProps) {
  const { start, end } = useTimerangeConnect()
  const dataviewsIds = useMemo(() => {
    return graphData.sublayers.map((s) => s.id)
  }, [graphData])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  const { description, commonProperties } = useAnalysisDescription(analysisAreaName, graphData)
  const showSpinner = loading && (!blur || !graphData)
  const hasData = graphData?.timeseries?.length > 0
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
      {showSpinner ? (
        <div className={styles.graphContainer}>
          <Spinner />
        </div>
      ) : hasData ? (
        <div className={blur ? styles.blur : ''}>
          <AnalysisEvolutionGraph graphData={graphData} start={start} end={end} />
        </div>
      ) : (
        <div className={styles.graphContainer}>
          <p>{t('graph.noDataByArea', 'No data available for the selected area')}</p>
        </div>
      )}
    </div>
  )
}

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
          <AnalysisItem
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

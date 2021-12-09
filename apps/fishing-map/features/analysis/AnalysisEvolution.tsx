import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import AnalysisEvolutionGraph, { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import styles from './AnalysisEvolution.module.css'
import useAnalysisDescription, { FIELDS } from './analysisDescription.hooks'
import { AnalysisTypeProps } from './Analysis'
import AnalysisDescription from './AnalysisDescription'

function AnalysisItem({
  graphData,
  hasAnalysisLayers,
  analysisAreaName,
  loading,
}: {
  graphData: AnalysisGraphProps
  hasAnalysisLayers: boolean
  analysisAreaName: string
  loading: boolean
}) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const dataviewsIds = useMemo(() => {
    return graphData.sublayers.map((s) => s.id)
  }, [graphData])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  const { description, commonProperties } = useAnalysisDescription(analysisAreaName, graphData)
  return (
    <div className={styles.container}>
      {hasAnalysisLayers ? (
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
      ) : (
        <p className={styles.placeholder}>
          {t('analysis.empty', 'Your selected datasets will appear here')}
        </p>
      )}
      {loading && (
        <div className={styles.graphContainer}>
          <Spinner />
        </div>
      )}
      {start && end && !loading && (
        <AnalysisEvolutionGraph graphData={graphData} start={start} end={end} />
      )}
    </div>
  )
}

const AnalysisEvolution: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, hasAnalysisLayers, analysisGeometryLoaded, analysisAreaName } =
    props

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  if (workspaceStatus !== AsyncReducerStatus.Finished || !layersTimeseriesFiltered)
    return (
      <div className={styles.graphContainer}>
        <Spinner />
      </div>
    )

  return (
    <Fragment>
      {layersTimeseriesFiltered?.map((layerTimeseriesFiltered, index) => {
        return (
          <AnalysisItem
            loading={!analysisGeometryLoaded || !layerTimeseriesFiltered.timeseries}
            hasAnalysisLayers={hasAnalysisLayers}
            analysisAreaName={analysisAreaName}
            key={index}
            graphData={layerTimeseriesFiltered}
          />
        )
      })}
    </Fragment>
  )
}

export default AnalysisEvolution

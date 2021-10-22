import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import AnalysisItemGraph, { AnalysisGraphProps } from './AnalysisItemGraph'
import styles from './AnalysisEvolution.module.css'
import useAnalysisDescription, { FIELDS } from './analysisDescription.hooks'
import { AnalysisTypeProps } from './Analysis'
import { useAnalysisGeometry } from './analysis.hooks'
import AnalysisDescription from './AnalysisDescription'

function AnalysisItem({
  graphData,
  hasAnalysisLayers,
  analysisAreaName,
}: {
  graphData: AnalysisGraphProps
  hasAnalysisLayers: boolean
  analysisAreaName: string
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
      {start && end && <AnalysisItemGraph graphData={graphData} start={start} end={end} />}
    </div>
  )
}

const AnalysisEvolution: React.FC<AnalysisTypeProps> = (props) => {
  const { layersTimeseriesFiltered, hasAnalysisLayers, analysisAreaName } = props
  const analysisGeometryLoaded = useAnalysisGeometry()
  const { t } = useTranslation()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  if (
    workspaceStatus === AsyncReducerStatus.Finished &&
    !analysisGeometryLoaded &&
    (!layersTimeseriesFiltered || !layersTimeseriesFiltered?.length)
  )
    return (
      <p className={styles.emptyDataPlaceholder}>{t('analysis.noData', 'No data available')}</p>
    )

  return workspaceStatus !== AsyncReducerStatus.Finished ||
    !analysisGeometryLoaded ||
    !layersTimeseriesFiltered ? (
    <Spinner className={styles.spinnerFull} />
  ) : (
    <Fragment>
      {layersTimeseriesFiltered.map((layerTimeseriesFiltered, index) => {
        return (
          <AnalysisItem
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

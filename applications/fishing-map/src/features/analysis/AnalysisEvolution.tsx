import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import AnalysisItemGraph, { AnalysisGraphProps } from './AnalysisItemGraph'
import styles from './AnalysisEvolution.module.css'
import useAnalysisDescription from './analysisDescription.hooks'
import { AnalysisTypeProps } from './Analysis'

const FIELDS = [
  ['geartype', 'layer.gearType_other', 'Gear types'],
  ['fleet', 'layer.fleet_other', 'Fleets'],
  ['origin', 'vessel.origin', 'Origin'],
  ['vessel_type', 'vessel.vesselType_other', 'Vessel types'],
]

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

  const { description, commonProperties } = useAnalysisDescription(graphData, analysisAreaName)

  return (
    <div className={styles.container}>
      {hasAnalysisLayers ? (
        <Fragment>
          <h3 className={styles.commonTitle}>
            {description.map((d) =>
              d.strong ? (
                <strong key={d.label}>{d.label}</strong>
              ) : (
                <span key={d.label}>{d.label}</span>
              )
            )}
            .
          </h3>
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
  const { t } = useTranslation()
  if (!layersTimeseriesFiltered || !layersTimeseriesFiltered?.length)
    return (
      <p className={styles.emptyDataPlaceholder}>{t('analysis.noData', 'No data available')}</p>
    )
  return (
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

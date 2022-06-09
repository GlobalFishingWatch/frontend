import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
import { t } from 'features/i18n/i18n'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectTimeComparisonValues } from 'features/analysis/analysis.selectors'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import AnalysisEvolutionGraph, { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import AnalysisBeforeAfterGraph from './AnalysisBeforeAfterGraph'
import AnalysisPeriodComparisonGraph, {
  ComparisonGraphProps,
} from './AnalysisPeriodComparisonGraph'
import styles from './AnalysisEvolution.module.css'
import useAnalysisDescription, { FIELDS } from './analysisDescription.hooks'
import AnalysisDescription from './AnalysisDescription'

export type AnalysisRowType = 'evolution' | 'before-after' | 'period-comparison'
type AnalysisRowProps = {
  type: AnalysisRowType
  blur: boolean
  loading: boolean
  graphData: AnalysisGraphProps | ComparisonGraphProps
  analysisAreaName: string
}
function AnalysisRow({
  blur,
  loading,
  graphData,
  analysisAreaName,
  type = 'evolution',
}: AnalysisRowProps) {
  const { start, end } = useTimerangeConnect()
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const dataviewsIds = useMemo(() => {
    return graphData.sublayers.map((s) => s.id)
  }, [graphData])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  const { description, commonProperties } = useAnalysisDescription(analysisAreaName, graphData)
  const showSpinner = loading && (!blur || !graphData)
  const hasData = graphData?.timeseries?.length > 0
  const Graph = {
    evolution: AnalysisEvolutionGraph,
    'before-after': AnalysisBeforeAfterGraph,
    'period-comparison': AnalysisPeriodComparisonGraph,
  }[type]
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
              hideColors={type !== 'evolution'}
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
          <Graph
            graphData={graphData}
            start={type === 'evolution' ? start : timeComparisonValues.start}
            end={type === 'evolution' ? end : timeComparisonValues.end}
          />
        </div>
      ) : (
        <div className={styles.graphContainer}>
          <p>{t('analysis.noDataByArea', 'No data available for the selected area')}</p>
        </div>
      )}
    </div>
  )
}

export default AnalysisRow

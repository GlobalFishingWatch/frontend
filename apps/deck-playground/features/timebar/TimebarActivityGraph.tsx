import cx from 'classnames'
import {
  HighlighterCallbackFn,
  HighlighterCallbackFnArgs,
  TimebarStackedActivity,
} from '@globalfishingwatch/timebar'
import { useStackedActivity } from 'features/timebar/TimebarActivityGraph.hooks'
import styles from './Timebar.module.css'

const TimebarActivityGraph = () => {
  return null
  // const layers = useGeoTemporalLayers()

  // const { loading, stackedActivity, error } = useStackedActivity(layers)

  // const style = useMapStyle()
  // const mapLegends = useMapLegend(style, activeDataviews)

  // const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
  //   ({ chunk, value, item }: HighlighterCallbackFnArgs) => {
  //     if (loading) return t('map.loading', 'Loading')
  //     if (!value || !value.value) return ''
  //     const dataviewId = item.props?.dataviewId
  //     const unit = mapLegends.find((l) => l.id === getLegendId(dataviewId))?.unit || ''
  //     const maxHighlighterFractionDigits =
  //       visualisation === TimebarVisualisations.Environment ? 2 : undefined
  //     const labels = [
  //       formatNumber(value.value, maxHighlighterFractionDigits),
  //       unit,
  //       t('common.onScreen', 'on screen'),
  //     ]
  //     if (visualisation === TimebarVisualisations.Environment) {
  //       labels.push(t('common.averageAbbreviated', 'avg.'))
  //     }

  //     return labels.join(' ')
  //   },
  //   [loading, mapLegends, visualisation]
  // )

  // if (error) {
  //   return (
  //     <div className={styles.error}>
  //       There was a problem loading the data, please try refreshing the page
  //     </div>
  //   )
  // }
  // if (!stackedActivity || !stackedActivity.length || !layers?.length) return null

  // return (
  //   <div className={cx({ [styles.loading]: loading })}>
  //     <TimebarStackedActivity
  //       key="stackedActivity"
  //       timeseries={stackedActivity}
  //       dataviews={layers}
  //       // highlighterCallback={getActivityHighlighterLabel}
  //       highlighterIconCallback="heatmap"
  //     />
  //   </div>
  // )
}

export default TimebarActivityGraph

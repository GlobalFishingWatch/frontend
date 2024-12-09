import cx from 'classnames'
import { useCallback, useMemo } from 'react'
import type {
  HighlighterCallbackFn,
  HighlighterCallbackFnArgs} from '@globalfishingwatch/timebar';
import {
  TimebarStackedActivity,
} from '@globalfishingwatch/timebar'
import { useStackedActivity } from 'features/timebar/TimebarActivityGraph.hooks'
import { useVisibleGeoTemporalLayers } from 'features/layers/layers.hooks'
import { useSelectedTimebarLayerId } from 'features/timebar/timebar.hooks'
import styles from './Timebar.module.css'

export const formatNumber = (num: string | number, maximumFractionDigits?: number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits || (number < 10 ? 2 : 0),
  })
}

const TimebarActivityGraph = () => {
  const layers = useVisibleGeoTemporalLayers()
  const [selectedLayerId] = useSelectedTimebarLayerId()
  const layer = useMemo(() => {
    if (selectedLayerId) {
      return layers.filter((l) => l.id === selectedLayerId)
    }
    return layers.length > 0 ? [layers[0]] : []
  }, [layers, selectedLayerId])

  const { loading, stackedActivity, error } = useStackedActivity(layer)

  // const style = useMapStyle()
  // const mapLegends = useMapLegend(style, activeDataviews)

  const getActivityHighlighterLabel: HighlighterCallbackFn = useCallback(
    ({ chunk, value, item }: HighlighterCallbackFnArgs) => {
      if (loading) return 'Loading'
      if (!value || !value.value) return ''
      const layer = layers.find((l) => l.id === item.props?.dataviewId)
      const unit = layer.dataset?.unit || ''
      const labels = [formatNumber(value.value, 2), unit, 'on screen avg.']

      return labels.join(' ')
    },
    [loading, layers]
  )

  if (error) {
    return (
      <div className={styles.error}>
        There was a problem loading the data, please try refreshing the page
      </div>
    )
  }
  if (!stackedActivity || !stackedActivity.length || !layers?.length) return null

  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={stackedActivity}
        dataviews={layer}
        highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback="heatmap"
      />
    </div>
  )
}

export default TimebarActivityGraph

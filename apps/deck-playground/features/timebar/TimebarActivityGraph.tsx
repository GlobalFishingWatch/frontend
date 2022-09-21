import cx from 'classnames'
import { useMemo } from 'react'
import {
  useFourwingsLayerInstance,
  useFourwingsLayerLoaded,
} from 'layers/fourwings/fourwings.hooks'
import { TimebarStackedActivity, Timeseries } from '@globalfishingwatch/timebar'
import { useMapFourwingsLayer } from 'features/map/layers.hooks'
import styles from './Timebar.module.css'

const TimebarActivityGraph = () => {
  const fourwingsLayerInstance = useFourwingsLayerInstance()
  const fourwingsLayerLoaded = useFourwingsLayerLoaded()
  const { id, visible } = useMapFourwingsLayer()

  const dataviews = useMemo(() => {
    return [{ id, visible }]
  }, [id, visible])

  const stackedActivity: Timeseries = useMemo(() => {
    if (fourwingsLayerLoaded) {
      const data = fourwingsLayerInstance.getHeatmapTimeseries()
      const dataArray = Object.keys(data)
        .map((key) => {
          return { date: parseInt(key), 0: data[key] }
        })
        .sort((a, b) => a.date - b.date)
      return dataArray
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fourwingsLayerLoaded])

  if (!stackedActivity || !stackedActivity.length || !fourwingsLayerInstance || !visible)
    return null

  // const loading = instance
  //   ? instance?.getSubLayers().every((l: any) => l.props.tile._isLoaded)
  //   : false
  const loading = false

  // TODO: check performance issues on mouser hover
  return (
    <div className={cx({ [styles.loading]: loading })}>
      <TimebarStackedActivity
        key="stackedActivity"
        timeseries={stackedActivity}
        dataviews={dataviews}
        // highlighterCallback={getActivityHighlighterLabel}
        highlighterIconCallback="heatmap"
      />
    </div>
  )
}

export default TimebarActivityGraph

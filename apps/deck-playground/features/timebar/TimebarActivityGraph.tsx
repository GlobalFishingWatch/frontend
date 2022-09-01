import cx from 'classnames'
import { useMemo } from 'react'
import { TimebarStackedActivity, Timeseries } from '@globalfishingwatch/timebar'
import { useMapFourwingsLayer } from 'features/map/layers.hooks'
import styles from './Timebar.module.css'

const TimebarActivityGraph = () => {
  const fourwingsLayer = useMapFourwingsLayer()
  const { visible, loaded, instance } = fourwingsLayer || {}

  const dataviews = useMemo(() => {
    return [fourwingsLayer]
  }, [fourwingsLayer])

  const stackedActivity: Timeseries = useMemo(() => {
    if (loaded && instance) {
      const data = instance.getDataFilteredByViewport()
      console.log('CALCULATING TIMEBAR TIMESERIES')
      const timeseries = data.flatMap((data) => {
        return data.timeseries.map((timeseries) => ({
          0: timeseries.value,
          frame: timeseries.frame,
          date: timeseries.frame,
        }))
      })
      return timeseries
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  if (!stackedActivity || !stackedActivity.length || !fourwingsLayer || !visible) return null

  const loading = instance
    ? instance?.getSubLayers().every((l: any) => l.props.tile._isLoaded)
    : false

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

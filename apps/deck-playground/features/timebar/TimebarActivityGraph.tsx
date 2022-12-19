import cx from 'classnames'
import { useMemo } from 'react'
import {
  useFourwingsLayerInstance,
  useFourwingsLayerLoaded,
} from 'layers/fourwings/fourwings.hooks'
import { groupBy } from 'lodash'
import { DateTime } from 'luxon'
import { TimebarStackedActivity, TimebarTracks } from '@globalfishingwatch/timebar'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { useMapFourwingsLayer } from 'features/map/layers.hooks'
import styles from './Timebar.module.css'

const getDateFromHtime = (day) => {
  return day * 1000 * 60 * 60
}

const TimebarActivityGraph = () => {
  const fourwingsLayerInstance = useFourwingsLayerInstance()
  const fourwingsLayerLoaded = useFourwingsLayerLoaded()
  const { id, visible } = useMapFourwingsLayer()
  const { mode } = fourwingsLayerInstance.props
  const dataviews = useMemo(() => {
    return [{ id, visible }]
  }, [id, visible])

  const formattedData = useMemo(() => {
    if (fourwingsLayerLoaded) {
      const data = fourwingsLayerInstance.getTimeseries()
      if (mode === 'heatmap') {
        const dataArray = Object.keys(data)
          .map((key) => {
            return { date: parseInt(key), 0: data[key] }
          })
          .sort((a, b) => a.date - b.date)
        return dataArray
      } else if (mode === 'positions') {
        const positionsByVessel = groupBy(data, 'properties.vesselId')
        const segments = Object.entries(positionsByVessel).flatMap(([vesselId, positions]) => {
          if (positions.length === 0) return []
          const timebarTrack = {
            status: ResourceStatus.Finished,
            chunks: positions.map((position) => {
              const color = fourwingsLayerInstance.layer?.getFillColor(position)
              return {
                start: getDateFromHtime(position.properties.htime),
                end: DateTime.fromMillis(getDateFromHtime(position.properties.htime))
                  .plus({ hours: position.properties.value })
                  .toMillis(),
                props: {
                  color: `rgba(${color[0]},${color[1]},${color[2]},${color[3] / 255})`,
                  height: 2,
                },
              }
            }),
            props: {
              vesselId,
            },
          }
          return timebarTrack
        })
        return segments.sort(() => (Math.random() > 0.5 ? 1 : -1))
      }
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fourwingsLayerLoaded])

  if (!formattedData || !formattedData.length || !fourwingsLayerInstance || !visible) return null

  // const loading = instance
  //   ? instance?.getSubLayers().every((l: any) => l.props.tile._isLoaded)
  //   : false
  const loading = false

  // TODO: check performance issues on mouser hover
  return (
    <div className={cx({ [styles.loading]: loading })}>
      {mode === 'heatmap' ? (
        <TimebarStackedActivity
          key="stackedActivity"
          timeseries={formattedData as any}
          dataviews={dataviews}
          // highlighterCallback={getActivityHighlighterLabel}
          highlighterIconCallback="heatmap"
        />
      ) : (
        <TimebarTracks key="tracks" data={formattedData as any} />
      )}
    </div>
  )
}

export default TimebarActivityGraph

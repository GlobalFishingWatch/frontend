import cx from 'classnames'
import { useMemo } from 'react'
import {
  FOURWINGS_SUBLAYERS,
  useFourwingsLayerInstance,
  useFourwingsLayerLoaded,
} from 'layers/fourwings/fourwings.hooks'
import { groupBy } from 'lodash'
import { DateTime } from 'luxon'
import { FourwingsPositionsTileLayer } from 'layers/fourwings/FourwingsPositionsTileLayer'
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
  const mode = fourwingsLayerInstance?.getMode()
  const dataviews = FOURWINGS_SUBLAYERS

  const formattedData = useMemo(() => {
    if (fourwingsLayerInstance && fourwingsLayerLoaded) {
      const data = fourwingsLayerInstance.getTimeseries()
      if (mode === 'heatmap') {
        // const dataArray = data
        //   .map((sublayerTimeseries, i) => {
        //     return Object.keys(sublayerTimeseries).map((key) => {
        //       return { date: parseInt(key), [i]: data[key] }
        //     })
        //   })
        //   .sort((a, b) => a.date - b.date)
        return data
      } else if (mode === 'positions') {
        const positionsByVessel = groupBy(data, 'properties.vesselId')
        const segments = Object.entries(positionsByVessel).flatMap(([vesselId, positions]) => {
          if (positions.length === 0) return []
          const timebarTrack = {
            status: ResourceStatus.Finished,
            chunks: positions.map((position) => {
              const color = (
                fourwingsLayerInstance.layers[0] as FourwingsPositionsTileLayer
              ).getFillColor(position)
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
          dataviews={dataviews as any}
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
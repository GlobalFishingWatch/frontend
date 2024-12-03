import { useContext, useMemo } from 'react'
import { quantile } from 'simple-statistics'
import DeckGL from '@deck.gl/react'
import { SolidPolygonLayer } from '@deck.gl/layers'
import type { OrthographicViewState } from '@deck.gl/core'
import { OrthographicView } from '@deck.gl/core'
import TimelineContext from '../timelineContext'
import { useFilteredChartData } from './common/hooks'
import { getTrackY } from './common/utils'
import type { TimebarChartData, TimebarChartChunk, TimebarChartItem } from '.'

const getMaxValues = (data: TimebarChartData) => {
  const maxValues = data.map((trackGraphData: TimebarChartItem) => {
    if (!trackGraphData.chunks.length) return 0
    const itemValues = trackGraphData.chunks.reduce(
      (acc: number[], currentChunk: TimebarChartChunk) => {
        const chunkValues = currentChunk.values!.map((v) => v.value as number)
        return acc.concat(chunkValues)
      },
      []
    )

    // https://online.stat.psu.edu/stat200/lesson/3/3.2
    const q1 = quantile(itemValues, 0.25)
    const q3 = quantile(itemValues, 0.75)
    const iqr = Math.abs(q3 - q1)
    const upperFence = Math.abs(q3 + iqr * 1.5)
    const lowerFence = Math.abs(q1 - iqr * 1.5)

    return upperFence > lowerFence ? upperFence : lowerFence
  })
  return maxValues
}

const SPEED_STEPS = [
  { value: 2, color: [0, 0, 255, 255] },
  { value: 4, color: [157, 2, 215, 255] },
  { value: 6, color: [205, 52, 181, 255] },
  { value: 10, color: [234, 95, 148, 255] },
  { value: 15, color: [250, 135, 117, 255] },
  { value: 25, color: [255, 177, 78, 255] },
  { value: Number.POSITIVE_INFINITY, color: [255, 215, 0, 255] },
]

const VIEW = new OrthographicView({ id: '2d-scene', controller: false })
const GRAPH_STYLE = { zIndex: '-1' }

const TrackGraph = ({ data }: { data: TimebarChartData }) => {
  const { outerScale, outerWidth, graphHeight, trackGraphOrientation } = useContext(TimelineContext)

  const initialViewState = useMemo(
    () =>
      ({
        target: [outerWidth / 2, graphHeight / 2, 0],
        zoom: 0,
      } as OrthographicViewState),
    [outerWidth]
  )

  const maxValues = useMemo(() => {
    return getMaxValues(data)
  }, [data])
  const filteredGraphsData = useFilteredChartData(data)

  const layers = useMemo(() => {
    const layerData = filteredGraphsData.flatMap((track, trackIndex) => {
      const trackY = getTrackY(data.length, trackIndex, graphHeight, trackGraphOrientation)
      return track.chunks.flatMap((segment) => {
        return (segment.values || [])?.flatMap(({ value = 0, timestamp }, index, array) => {
          const x1 = outerScale(timestamp)
          const x2 = outerScale(array[index + 1]?.timestamp || Number.POSITIVE_INFINITY)
          const height = (value / maxValues[trackIndex]) * trackY.height
          const y1 = trackY.y - height / 2
          const y2 = trackY.y + height / 2
          if (!x1 || !x2 || !y1 || !y2) {
            return []
          }
          return {
            polygon: [x1, y1, x2, y1, x2, y2, x1, y2],
            color: SPEED_STEPS.find((step) => value < step.value)?.color,
          }
        })
      })
    })
    return [
      new SolidPolygonLayer({
        id: 'polygon-layer',
        data: layerData,
        _normalize: false,
        positionFormat: 'XY',
        getPolygon: (d) => d.polygon,
        getFillColor: (d) => d.color,
      }),
    ]
  }, [filteredGraphsData, outerScale])

  return (
    <DeckGL
      views={VIEW}
      initialViewState={initialViewState}
      layers={layers}
      width={outerWidth}
      height={graphHeight}
      style={GRAPH_STYLE}
    />
  )
}

export default TrackGraph

import { useContext, useMemo } from 'react'
import { quantile } from 'simple-statistics'
import DeckGL from '@deck.gl/react'
import { SolidPolygonLayer } from '@deck.gl/layers'
import type { OrthographicViewState } from '@deck.gl/core'
import { OrthographicView } from '@deck.gl/core'
import TimelineContext from '../timelineContext'
import { useUpdateChartsData } from './chartsData.atom'
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
  { value: 1, color: [61, 41, 149, 255] }, // #4B2AA3
  { value: 2, color: [61, 41, 149, 255] }, // #632995
  { value: 4, color: [140, 41, 146, 255] }, // #8C2992
  { value: 6, color: [186, 58, 143, 255] }, // #BA3A8F
  { value: 8, color: [232, 88, 133, 255] }, // #E05885
  { value: 10, color: [252, 123, 121, 255] }, // #FC7B79
  { value: 15, color: [255, 163, 105, 255] }, // #FFA369
  { value: 20, color: [255, 204, 79, 255] }, // #FFCC4F
  { value: 15, color: [255, 246, 80, 255] }, // #FFF650
  { value: Number.POSITIVE_INFINITY, color: [255, 249, 146, 255] }, // #FFF992
]

const DEPTH_STEPS = [
  { value: -100, color: [255, 249, 146, 255] }, // #FFF992
  { value: -200, color: [255, 246, 80, 255] }, // #FFF650
  { value: -500, color: [255, 204, 79, 255] }, // #FFCC4F
  { value: -1000, color: [255, 163, 105, 255] }, // #FFA369
  { value: -2000, color: [252, 123, 121, 255] }, // #FC7B79
  { value: -3000, color: [232, 88, 133, 255] }, // #E05885
  { value: -4000, color: [186, 58, 143, 255] }, // #BA3A8F
  { value: -5000, color: [140, 41, 146, 255] }, // #8C2992
  { value: -6000, color: [61, 41, 149, 255] }, // #632995
  { value: Number.NEGATIVE_INFINITY, color: [61, 41, 149, 255] }, // #4B2AA3
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
  useUpdateChartsData('tracksGraphs', filteredGraphsData)

  const layers = useMemo(() => {
    const layerData = filteredGraphsData.flatMap((track, trackIndex) => {
      const trackY = getTrackY(data.length, trackIndex, graphHeight, trackGraphOrientation)
      return track.chunks.flatMap((segment) => {
        return (segment.values || [])?.flatMap(({ value = 0, timestamp }, index, array) => {
          const x1 = outerScale(timestamp)
          const x2 = outerScale(array[index + 1]?.timestamp || Number.POSITIVE_INFINITY)
          const height = (value / maxValues[trackIndex]) * trackY.height
          let y1
          let y2
          if (trackGraphOrientation === 'mirrored') {
            y1 = trackY.defaultY - height / 2
            y2 = trackY.defaultY + height / 2
          } else if (trackGraphOrientation === 'down') {
            y1 = trackY.defaultY
            y2 = trackY.defaultY - height
          } else if (trackGraphOrientation === 'up') {
            y1 = trackY.defaultY - height
            y2 = trackY.defaultY
          }
          if (!x1 || !x2 || !y1 || !y2) {
            return []
          }
          return {
            polygon: [x1, y1, x2, y1, x2, y2, x1, y2],
            color:
              trackGraphOrientation === 'down'
                ? DEPTH_STEPS.find((step) => value >= step.value)?.color
                : SPEED_STEPS.find((step) => value <= step.value)?.color,
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

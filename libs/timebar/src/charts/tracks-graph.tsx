import { useContext, useMemo, useRef } from 'react'
import DeckGL from '@deck.gl/react'
import { SolidPolygonLayer } from '@deck.gl/layers'
import type { OrthographicViewState } from '@deck.gl/core'
import { OrthographicView } from '@deck.gl/core'
import { scaleSqrt } from 'd3-scale'
import { VESSEL_DEPTH_STEPS, VESSEL_SPEED_STEPS } from '@globalfishingwatch/deck-layers'
import TimelineContext from '../timelineContext'
import { useUpdateChartsData } from './chartsData.atom'
import { useFilteredChartData } from './common/hooks'
import { getTrackY } from './common/utils'
import type { TimebarChartData } from '.'

const VIEW = new OrthographicView({ id: '2d-scene', controller: false })
const GRAPH_STYLE = { zIndex: '-1' }

const TrackGraph = ({ data }: { data: TimebarChartData }) => {
  const { outerScale, innerWidth, outerWidth, graphHeight, trackGraphOrientation, start } =
    useContext(TimelineContext)
  const oldOuterScaleRef = useRef(outerScale)
  const offsetHashRef = useRef(Date.now())

  const oldStartX = oldOuterScaleRef.current(new Date(start))
  const startX = outerScale(new Date(start))
  const offsetStartX = startX - oldStartX
  const veilWidth = (outerWidth - innerWidth) / 2
  offsetHashRef.current = Math.abs(offsetStartX) > veilWidth ? Date.now() : offsetHashRef.current

  const filteredGraphsData = useFilteredChartData(data)
  useUpdateChartsData('tracksGraphs', filteredGraphsData)

  const initialViewState = useMemo(
    () =>
      ({
        target: [outerWidth / 2, graphHeight / 2, 0],
        zoom: 0,
      } as OrthographicViewState),
    [outerWidth]
  )

  const heightScale = useMemo(() => {
    if (!filteredGraphsData.length) return undefined
    let domainEnd = 0
    filteredGraphsData.forEach(({ chunks }) => {
      chunks.forEach((c) => {
        c.values!.forEach((v) => {
          if (v.value) {
            if (trackGraphOrientation === 'down') {
              if (v.value < domainEnd) {
                domainEnd = v.value
              }
            } else if (v.value > domainEnd) domainEnd = v.value
          }
        })
      })
    })
    const { height } = getTrackY(filteredGraphsData.length, 0, graphHeight)
    return scaleSqrt([0, domainEnd], [2, height]).clamp(true)
  }, [filteredGraphsData])

  const layers = useMemo(() => {
    if (!heightScale) return []
    oldOuterScaleRef.current = outerScale
    const layerData = filteredGraphsData.flatMap((track, trackIndex) => {
      const trackY = getTrackY(data.length, trackIndex, graphHeight, trackGraphOrientation)
      return track.chunks.flatMap((segment) => {
        return (segment.values || [])?.flatMap(({ value = 0, timestamp }, index, array) => {
          const x1 = outerScale(timestamp)
          const x2 = outerScale(array[index + 1]?.timestamp || Number.POSITIVE_INFINITY)
          const height = heightScale(value)
          let y1
          let y2
          if (trackGraphOrientation === 'mirrored') {
            y1 = trackY.defaultY - height / 2
            y2 = trackY.defaultY + height / 2
          } else {
            y1 = trackY.defaultY
            y2 = trackY.defaultY + height
          }
          if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
            return []
          }
          return {
            polygon: [x1, y1, x2, y1, x2, y2, x1, y2],
            color:
              trackGraphOrientation === 'down'
                ? VESSEL_DEPTH_STEPS.find((step) => value >= step.value)?.color
                : VESSEL_SPEED_STEPS.find((step) => value <= step.value)?.color,
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
  }, [filteredGraphsData, offsetHashRef.current, trackGraphOrientation, outerWidth])

  return (
    <div style={{ transform: `translateX(${offsetStartX - veilWidth}px)`, zIndex: -1 }}>
      <DeckGL
        views={VIEW}
        initialViewState={initialViewState}
        layers={layers}
        width={outerWidth + veilWidth * 2}
        height={graphHeight}
        style={GRAPH_STYLE}
      />
    </div>
  )
}

export default TrackGraph

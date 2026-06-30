import { useMemo } from 'react'
import { SolidPolygonLayer } from '@deck.gl/layers'
import { scaleSqrt } from 'd3-scale'

import { hexToDeckColor } from '@globalfishingwatch/deck-layers'

import { useTimelineContext } from '../timeline/timeline-context'

import type { TimebarChartData } from '.'
import { useTimebarTimeOrigin } from './charts.hooks'
import { getTrackY } from './charts.utils'
import { useUpdateChartLayers, useUpdateChartsData } from './charts-store.atom'

type TimebarChartSteps = { value: number; color: string }[]
type TimebarChartProps = { data: TimebarChartData; steps: TimebarChartSteps }

export const TimebarTracksGraph = ({ data, steps }: TimebarChartProps) => {
  const { graphHeight, trackGraphOrientation } = useTimelineContext()
  const origin = useTimebarTimeOrigin()

  useUpdateChartsData('tracksGraphs', data)

  const heightScale = useMemo(() => {
    if (!steps?.length) return undefined
    const domainEnd =
      trackGraphOrientation === 'down'
        ? Math.min(...steps.map((step) => step.value || 0))
        : Math.max(...steps.map((step) => step.value || 0))
    const { height } = getTrackY(data.length, 0, graphHeight)
    return scaleSqrt([0, domainEnd], [2, height]).clamp(true)
  }, [data.length, graphHeight, steps, trackGraphOrientation])

  const layers = useMemo(() => {
    if (!heightScale || !steps.length) return []
    const layerData = data.flatMap((track, trackIndex) => {
      const trackY = getTrackY(data.length, trackIndex, graphHeight, trackGraphOrientation)
      return track.chunks.flatMap((segment) => {
        return (segment.values || [])?.flatMap(({ value = 0, timestamp }, index, array) => {
          const nextTimestamp = array[index + 1]?.timestamp
          if (nextTimestamp == null) {
            return []
          }
          const x1 = timestamp - origin
          const x2 = nextTimestamp - origin
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
          const color =
            steps?.find((step) =>
              trackGraphOrientation === 'down' ? value >= step.value : value <= step.value
            )?.color || steps[steps.length - 1].color
          const colorResolved = [...hexToDeckColor(color)]
          if (
            track.filters &&
            ((track.filters.minElevationFilter && value < track.filters.minElevationFilter) ||
              (track.filters.maxElevationFilter && value > track.filters.maxElevationFilter) ||
              (track.filters.minSpeedFilter && value < track.filters.minSpeedFilter) ||
              (track.filters.maxSpeedFilter && value > track.filters.maxSpeedFilter))
          ) {
            colorResolved[3] = 50
          }
          return {
            polygon: [x1, y1, x2, y1, x2, y2, x1, y2],
            color: colorResolved,
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
  }, [heightScale, steps, origin, data, graphHeight, trackGraphOrientation])

  useUpdateChartLayers('tracksGraphs', layers)

  return null
}

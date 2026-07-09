import { useMemo } from 'react'
import { SolidPolygonLayer } from '@deck.gl/layers'
import { max } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { stack, stackOffsetSilhouette } from 'd3-shape'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { hexToDeckColor } from '@globalfishingwatch/deck-layers'

import { useTimelineContext } from '../timeline/timeline-context'

import { useTimebarTimeOrigin, useTimeseriesToChartData } from './charts.hooks'
import type { HighlighterCallback, HighlighterIconCallback, Timeseries } from './charts.types'
import { useUpdateChartLayers, useUpdateChartsData } from './charts-store.atom'

const MARGIN_BOTTOM = 20
const MARGIN_TOP = 5

const getSubLayers = (timeseries: Timeseries) =>
  Object.keys(timeseries?.[0] ?? {}).filter((k) => k !== 'date' && k !== 'count')

const getEdges = (point: number[], y: (v: number) => number, numSubLayers: number) => {
  const y0 = y(point[0])
  const y1 = y(point[1])
  const value = point[1] - point[0]
  const height = y1 - y0
  if (value > 1 && height < 1) {
    return [y0 - (1 - height) / 2, y1 + (1 - height) / 2]
  }
  return [
    numSubLayers === 1 && y0 < 0 ? Math.min(y0, -1) : y0,
    numSubLayers === 1 && y1 > 0 ? Math.max(y1, 1) : y1,
  ]
}

export const TimebarStackedActivity = ({
  timeseries,
  dataviews,
  highlighterCallback,
  highlighterIconCallback,
  loading = false,
}: {
  timeseries: Timeseries
  dataviews: UrlDataviewInstance[]
  highlighterCallback?: HighlighterCallback
  highlighterIconCallback?: HighlighterIconCallback
  loading?: boolean
}) => {
  const { graphHeight } = useTimelineContext()
  const origin = useTimebarTimeOrigin()

  const dataAsTimebarChartData = useTimeseriesToChartData(
    timeseries,
    dataviews,
    highlighterCallback,
    highlighterIconCallback
  )
  useUpdateChartsData('activity', dataAsTimebarChartData, loading)

  const subLayers = useMemo(() => getSubLayers(timeseries), [timeseries])
  const middleY = graphHeight / 2 - MARGIN_BOTTOM / 2

  const layers = useMemo(() => {
    const numSubLayers = subLayers.length
    if (!timeseries || !numSubLayers) return []

    const series = stack().keys(subLayers).offset(stackOffsetSilhouette)(timeseries)
    const maxY = max(series, (d) => max(d, (d) => d[1])) as number
    const y = scaleLinear()
      .domain([0, maxY])
      .range([MARGIN_TOP, graphHeight / 2 - MARGIN_BOTTOM / 2])

    const layerData = series.flatMap((s, sublayerIndex) => {
      if (!dataviews[sublayerIndex]) return []
      const color = hexToDeckColor(dataviews[sublayerIndex]?.config?.color || '#ffffff')
      return s.slice(0, -1).flatMap((point, i) => {
        const x1 = (point as any).data.date - origin
        const x2 = (s[i + 1] as any).data.date - origin
        const [lo, hi] = getEdges(point as unknown as number[], y, numSubLayers)
        const yLo = lo + middleY
        const yHi = hi + middleY
        if (isNaN(x1) || isNaN(x2) || isNaN(yLo) || isNaN(yHi)) {
          return []
        }
        return { polygon: [x1, yLo, x2, yLo, x2, yHi, x1, yHi], color }
      })
    })

    return [
      new SolidPolygonLayer({
        id: 'stacked-activity-layer',
        data: layerData,
        _normalize: false,
        positionFormat: 'XY',
        getPolygon: (d) => d.polygon,
        getFillColor: (d) => d.color,
      }),
    ]
  }, [timeseries, subLayers, dataviews, graphHeight, middleY, origin])

  useUpdateChartLayers('activity', layers)

  return null
}

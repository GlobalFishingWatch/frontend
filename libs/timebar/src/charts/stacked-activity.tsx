import React, { useContext, useMemo } from 'react'
import { max } from 'd3-array'
import { scaleLinear } from 'd3-scale'
import { area, curveStepAfter,stack, stackOffsetSilhouette } from 'd3-shape'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { DEFAULT_CSS_TRANSITION } from '../constants'
import type { TimelineScale } from '../timelineContext';
import TimelineContext from '../timelineContext'

import { useTimeseriesToChartData } from './common/hooks'
import type { HighlighterCallback,Timeseries } from './common/types'
import { useUpdateChartsData } from './chartsData.atom'

const MARGIN_BOTTOM = 20
const MARGIN_TOP = 5

const getSubLayers = (timeseries: Timeseries) =>
  Object.keys(timeseries?.[0]).filter((k) => k !== 'date')

const getPathContainers = (
  timeseries: Timeseries,
  subLayers: string[],
  graphHeight: number,
  overallScale: TimelineScale
) => {
  if (!timeseries) return []
  const numSubLayers = subLayers.length
  if (!numSubLayers) return []

  const stackLayout = stack().keys(subLayers).offset(stackOffsetSilhouette)

  const series = stackLayout(timeseries)
  const maxY = max(series, (d) => max(d, (d) => d[1])) as number
  const y = scaleLinear()
    .domain([0, maxY])
    .range([MARGIN_TOP, graphHeight / 2 - MARGIN_BOTTOM / 2])

  const areaLayout = area()
    .x((d) => overallScale((d as any).data.date))
    .y0((d) => {
      const y0 = y(d[0])
      return numSubLayers === 1 && y0 < 0 ? Math.min(y0, -1) : y0
    })
    .y1((d) => {
      const y1 = y(d[1])
      return numSubLayers === 1 && y1 > 0 ? Math.max(y1, 1) : y1
    })
    .curve(curveStepAfter)

  const layouted = series.map((s) => {
    return {
      path: areaLayout(s as any),
    }
  })

  return layouted
}

const StackedActivity = ({
  timeseries,
  dataviews,
  highlighterCallback,
  highlighterIconCallback,
}: {
  timeseries: Timeseries
  dataviews: UrlDataviewInstance[]
  highlighterCallback?: HighlighterCallback
  highlighterIconCallback?: HighlighterCallback
}) => {
  // todo replace with outerScale hook
  const { overallScale, outerWidth, graphHeight, svgTransform } = useContext(TimelineContext)
  const dataAsTimebarChartData = useTimeseriesToChartData(
    timeseries,
    dataviews,
    highlighterCallback,
    highlighterIconCallback
  )
  useUpdateChartsData('activity', dataAsTimebarChartData)
  const subLayers = useMemo(() => getSubLayers(timeseries), [timeseries])
  const hasSublayers = subLayers?.length > 0
  const pathContainers = useMemo(() => {
    const pathContainers = getPathContainers(timeseries, subLayers, graphHeight, overallScale)
    return pathContainers
  }, [timeseries, graphHeight, overallScale, subLayers])

  const middleY = graphHeight / 2 - MARGIN_BOTTOM / 2
  return (
    <svg width={outerWidth} height={graphHeight}>
      <g
        transform={svgTransform}
        style={{
          transition: 'none',
        }}
      >
        {hasSublayers &&
          pathContainers &&
          pathContainers.map((pathContainer, sublayerIndex) => {
            return dataviews[sublayerIndex] ? (
              <g key={sublayerIndex} transform={`translate(0, ${middleY})`}>
                <path
                  d={pathContainer.path || ''}
                  fill={dataviews[sublayerIndex]?.config?.color || '#ffffff'}
                />
              </g>
            ) : null
          })}
      </g>
    </svg>
  )
}

export default StackedActivity

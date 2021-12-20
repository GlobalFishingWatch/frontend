import React, { useContext, useMemo } from 'react'
import { area, curveStepAfter } from 'd3-shape'
import { quantile } from 'simple-statistics'
import ImmediateContext from '../immediateContext'
import { TimelineContext, TimelineContextProps, TimelineScale } from '..'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { useFilteredChartData } from './common/hooks'
import { getTrackY } from './common/utils'
import { TimebarChartData, TimebarChartDataChunk, TimebarChartDataItem } from '.'

const getMaxValues = (data: TimebarChartData) => {
  const maxValues = data.map((trackGraphData: TimebarChartDataItem) => {
    if (!trackGraphData.chunks.length) return 0
    const itemValues = trackGraphData.chunks.reduce(
      (acc: number[], currentChunk: TimebarChartDataChunk) => {
        const chunkValues = currentChunk.values!.map((v) => v.value as number)
        return acc.concat(chunkValues)
      },
      []
    )

    // https://online.stat.psu.edu/stat200/lesson/3/3.2
    const q1 = quantile(itemValues, 0.25)
    const q3 = quantile(itemValues, 0.75)
    const iqr = Math.abs(q3 - q1)
    const upperFence = Math.abs(q3 + iqr)
    const lowerFence = Math.abs(q1 - iqr)

    return upperFence > lowerFence ? upperFence : lowerFence
  })
  return maxValues
}

const getPaths = (
  trackGraphData: TimebarChartDataItem,
  numTracks: number,
  trackIndex: number,
  graphHeight: number,
  overallScale: TimelineScale,
  maxValue: number,
  orientation: string
) => {
  const trackY = getTrackY(numTracks, trackIndex, graphHeight)
  const getPx = (d: any) => ((d as any).value / maxValue) * trackY.height

  const areaGenerator = area()
    .x((d) => overallScale((d as any).timestamp))
    .y0((d) => {
      if (orientation === 'down') return trackY.y0
      if (orientation === 'middle') return trackY.y - getPx(d) / 2
      return trackY.y0 + trackY.height - getPx(d)
    })
    .y1((d) => {
      if (orientation === 'up') return trackY.y1
      if (orientation === 'middle') return trackY.y + getPx(d) / 2
      return trackY.y0 + Math.abs(getPx(d))
    })
    .curve(curveStepAfter)

  const paths = trackGraphData.chunks.map((chunk) => {
    return areaGenerator(chunk.values as any)
  })

  return paths
}

const getPathContainers = (
  tracksGraphData: TimebarChartData,
  graphHeight: number,
  overallScale: TimelineScale,
  maxValues: number[],
  orientation: string
) => {
  if (!tracksGraphData) return []
  return tracksGraphData.map((trackGraphData, i) => {
    return {
      paths: getPaths(
        trackGraphData,
        tracksGraphData.length,
        i,
        graphHeight,
        overallScale,
        maxValues[i],
        orientation
      ),
      color: trackGraphData.color,
    }
  })
}

const TrackGraph = ({
  data,
  orientation = 'up',
}: {
  data: TimebarChartData
  orientation?: string
}) => {
  const { immediate } = useContext(ImmediateContext) as any
  const { overallScale, outerWidth, graphHeight, svgTransform } = useContext(
    TimelineContext
  ) as TimelineContextProps
  const maxValues = useMemo(() => {
    return getMaxValues(data)
  }, [data])
  const filteredGraphsData = useFilteredChartData(data)
  const pathContainers = useMemo(() => {
    return getPathContainers(filteredGraphsData, graphHeight, overallScale, maxValues, orientation)
  }, [filteredGraphsData, graphHeight, overallScale, maxValues, orientation])

  return (
    <svg width={outerWidth} height={graphHeight}>
      <g
        transform={svgTransform}
        style={{
          transition: immediate ? 'none' : `transform ${DEFAULT_CSS_TRANSITION}`,
        }}
      >
        {pathContainers.map((pathContainer, trackIndex) => {
          return pathContainer.paths.map((path, i) => (
            <path
              key={`${trackIndex}-${i}`}
              d={path as string}
              fill={pathContainer.color}
              fillOpacity={0.5}
            />
          ))
        })}
      </g>
    </svg>
  )
}

export default TrackGraph

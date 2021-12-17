import React, { useContext, useMemo } from 'react'
import {
  area,
  curveStepAfter,
  // curveStepBefore,
  // curveLinear,
  // curveBasis,
  // curveCatmullRom,
  // curveCardinal,
} from 'd3-shape'
import { quantile } from 'd3-array'
import ImmediateContext from '../immediateContext'
import { TimelineContext, TimelineContextProps, TimelineScale } from '..'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import { useFilteredChartData } from './common/hooks'
import {
  TimebarChartData,
  TimebarChartDataChunk,
  TimebarChartDataChunkValue,
  TimebarChartDataItem,
} from '.'

const TOP_MARGIN = 5
const BOTTOM_MARGIN = 20
const MIN_HEIGHT = 2

const getMaxValues = (data: TimebarChartData) => {
  const maxValues = data.map((trackGraphData: TimebarChartDataItem) => {
    const itemValues = trackGraphData.chunks.reduce(
      (acc: number[], currentChunk: TimebarChartDataChunk) => {
        const chunkValues = currentChunk.values!.map((v) => v.value as number)
        return acc.concat(chunkValues)
      },
      []
    )
    // https://online.stat.psu.edu/stat200/lesson/3/3.2
    const q25 = quantile(itemValues, 0.25)
    const q75 = quantile(itemValues, 0.75)
    const q1 = Math.min(q25!, q75!)
    const q3 = Math.max(q25!, q75!)
    const iqr = q3 - q1
    const upperFence = q3 + 1.5 * iqr

    return upperFence
  })
  return maxValues
}

const getPaths = (
  trackGraphData: TimebarChartDataItem,
  graphHeight: number,
  overallScale: TimelineScale,
  maxValue: number,
  mode = 'mirror'
) => {
  const finalHeight = graphHeight - TOP_MARGIN - BOTTOM_MARGIN
  const middle = Math.round(TOP_MARGIN + finalHeight / 2)
  const bottom = Math.round(TOP_MARGIN + finalHeight)

  const minHeight = mode === 'mirror' ? MIN_HEIGHT / 2 : MIN_HEIGHT
  const valuePx = (d: TimebarChartDataChunkValue) =>
    minHeight + (finalHeight * (d.value || 1)) / maxValue / 2

  const upper = (d: TimebarChartDataChunkValue) => middle - valuePx(d)
  const lower = (d: TimebarChartDataChunkValue) => middle + valuePx(d)

  const areaGenerator = area()
    .x((d) => overallScale((d as any).timestamp))
    .y0(mode === 'mirror' || mode === 'up' ? (upper as any) : middle)
    .y1(mode === 'mirror' || mode === 'down' ? (lower as any) : bottom)
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
  maxValues: number[]
) => {
  if (!tracksGraphData) return []
  return tracksGraphData.map((trackGraphData, i) => {
    return {
      paths: getPaths(
        trackGraphData,
        graphHeight,
        overallScale,
        maxValues[i],
        tracksGraphData.length === 1 ? 'mirror' : i === 0 ? 'up' : 'down'
      ),
      color: trackGraphData.color,
    }
  })
}

const TrackGraph = ({ data }: { data: TimebarChartData }) => {
  const { immediate } = useContext(ImmediateContext) as any
  const { overallScale, outerWidth, graphHeight, svgTransform } = useContext(
    TimelineContext
  ) as TimelineContextProps
  const maxValues = useMemo(() => {
    return getMaxValues(data)
  }, [data])
  const filteredGraphsData = useFilteredChartData(data)
  const pathContainers = useMemo(() => {
    return getPathContainers(filteredGraphsData, graphHeight, overallScale, maxValues)
  }, [filteredGraphsData, graphHeight, overallScale])

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

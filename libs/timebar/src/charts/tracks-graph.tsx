import React, { useContext, useMemo } from 'react'
import { area, curveStepAfter } from 'd3-shape'
import { quantile } from 'simple-statistics'
import type { TimelineScale, TrackGraphOrientation } from '../timelineContext';
import TimelineContext from '../timelineContext'
import { useFilteredChartData } from './common/hooks'
import { getTrackY } from './common/utils'
import { useUpdateChartsData } from './chartsData.atom'
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

const getPaths = ({
  trackGraphData,
  numTracks,
  trackIndex,
  graphHeight,
  overallScale,
  maxValue,
  orientation,
}: {
  trackGraphData: TimebarChartItem
  numTracks: number
  trackIndex: number
  graphHeight: number
  overallScale: TimelineScale
  maxValue: number
  orientation: TrackGraphOrientation
}) => {
  const trackY = getTrackY(numTracks, trackIndex, graphHeight, orientation)
  const getPx = (d: any) => ((d as any).value / maxValue) * trackY.height

  const areaGenerator = area()
    .x((d) => overallScale((d as any).timestamp))
    .y0((d) => {
      if (orientation === 'down') return trackY.defaultY
      if (orientation === 'mirrored') return trackY.y - getPx(d) / 2
      return trackY.y0 + trackY.height - getPx(d)
    })
    .y1((d) => {
      if (orientation === 'up') return trackY.defaultY
      if (orientation === 'mirrored') return trackY.y + getPx(d) / 2
      return trackY.y0 + Math.abs(getPx(d))
    })
    .curve(curveStepAfter)

  const paths = trackGraphData.chunks.map((chunk) => {
    return areaGenerator(chunk.values as any)
  })

  return paths
}

const getPathContainers = ({
  tracksGraphData,
  graphHeight,
  overallScale,
  maxValues,
  orientation,
}: {
  tracksGraphData: TimebarChartData
  graphHeight: number
  overallScale: TimelineScale
  maxValues: number[]
  orientation: TrackGraphOrientation
}) => {
  if (!tracksGraphData) return []
  return tracksGraphData.map((trackGraphData, i) => {
    return {
      paths: getPaths({
        trackGraphData,
        numTracks: tracksGraphData.length,
        trackIndex: i,
        graphHeight,
        overallScale,
        maxValue: maxValues[i],
        orientation,
      }),
      color: trackGraphData.color,
    }
  })
}

const TrackGraph = ({ data }: { data: TimebarChartData }) => {
  const { overallScale, outerWidth, graphHeight, svgTransform, trackGraphOrientation } =
    useContext(TimelineContext)
  const maxValues = useMemo(() => {
    return getMaxValues(data)
  }, [data])
  const filteredGraphsData = useFilteredChartData(data)
  useUpdateChartsData('tracksGraphs', filteredGraphsData)

  const graph = useMemo(() => {
    const pathContainers = getPathContainers({
      tracksGraphData: filteredGraphsData,
      graphHeight,
      overallScale,
      maxValues,
      orientation: trackGraphOrientation,
    })
    return (
      <svg width={outerWidth} height={graphHeight}>
        <g transform={svgTransform}>
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
  }, [
    filteredGraphsData,
    graphHeight,
    overallScale,
    maxValues,
    trackGraphOrientation,
    outerWidth,
    svgTransform,
  ])

  return graph
}

export default TrackGraph

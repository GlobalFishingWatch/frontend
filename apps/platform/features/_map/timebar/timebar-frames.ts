import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getAvailableIntervalsInDataviews } from '@globalfishingwatch/deck-layer-composer'
import type {
  FourwingsClustersLayer,
  FourwingsLayer,
  FourwingsVisualizationMode,
  UserPointsTileLayer,
} from '@globalfishingwatch/deck-layers'
import { getFourwingsChunk } from '@globalfishingwatch/deck-layers'
import type {
  FourwingsPointFeature,
  FourwingsPositionFeature,
  FourwingsValuesAndStartFrameFeature,
} from '@globalfishingwatch/deck-loaders'
import { FOURWINGS_REAL_TIME_INTERVALS } from '@globalfishingwatch/deck-loaders'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'

import {
  getGraphDataFromFourwingsHeatmap,
  getGraphDataFromFourwingsPositions,
  getGraphDataFromPoints,
} from './timebar.utils'

/**
 * The frames each timebar graph draws, from the deck layer data in the viewport. Pure: the graph
 * hooks call them when the view changes, the assistant `get_timebar` tool when the agent asks.
 */

const EMPTY_FRAMES = [] as ActivityTimeseriesFrame[]

export type TimebarChunkParams = {
  /** ms */
  start: number
  end: number
  dataviews: UrlDataviewInstance[]
  isRealTimeMode?: boolean
  realTimeTimerange?: { start: string; end: string } | null
}

export type TimebarChunk = ReturnType<typeof getFourwingsChunk>

export function getTimebarChunk({
  start,
  end,
  dataviews,
  isRealTimeMode,
  realTimeTimerange,
}: TimebarChunkParams): TimebarChunk {
  return getFourwingsChunk({
    start,
    end,
    availableIntervals: isRealTimeMode
      ? FOURWINGS_REAL_TIME_INTERVALS
      : getAvailableIntervalsInDataviews(dataviews),
    ...(isRealTimeMode &&
      realTimeTimerange && {
        intervalCacheMode: 'NONE',
        bufferedStartTime: getUTCDate(realTimeTimerange.start).getTime(),
        bufferedEndTime: getUTCDate(realTimeTimerange.end).getTime(),
      }),
  })
}

/** Heatmap activity, detections, vessel group and environment graphs */
export function getHeatmapActivityFrames(
  instance: FourwingsLayer,
  chunk: TimebarChunk,
  visualizationMode?: FourwingsVisualizationMode
): ActivityTimeseriesFrame[] {
  const params = { start: chunk.bufferedStart, end: chunk.bufferedEnd, interval: chunk.interval }
  if (visualizationMode === 'positions') {
    return (
      getGraphDataFromFourwingsPositions(
        instance.getViewportData?.() as FourwingsPositionFeature[],
        { ...params, sublayersLength: instance.props.sublayers.length }
      ) || EMPTY_FRAMES
    )
  }
  const data = instance.getViewportData?.({
    onlyValuesAndStartFrame: true,
  }) as FourwingsValuesAndStartFrameFeature[]
  if (!data?.length) return EMPTY_FRAMES
  return getGraphDataFromFourwingsHeatmap(data, {
    ...params,
    sublayers: instance.props.sublayers,
    aggregationOperation: instance.props.aggregationOperation,
  })
}

/** Events clusters graph: one sublayer per events dataview */
export function getClusterEventsFrames(
  instances: FourwingsClustersLayer[],
  chunk: TimebarChunk,
  sublayersLength: number
): ActivityTimeseriesFrame[] {
  const viewportData = instances.flatMap((instance, index) =>
    (instance?.getViewportData?.() ?? []).map(
      (feature) =>
        ({
          ...feature,
          properties: { ...feature.properties, layer: index } as any,
        }) as FourwingsPointFeature
    )
  )
  return (
    getGraphDataFromFourwingsPositions(viewportData, {
      start: chunk.bufferedStart,
      end: chunk.bufferedEnd,
      interval: chunk.interval,
      sublayersLength,
    }) || EMPTY_FRAMES
  )
}

/** Uploaded points graph */
export function getPointsFrames(
  instance: UserPointsTileLayer,
  chunk: TimebarChunk
): ActivityTimeseriesFrame[] {
  const { startTimeProperty, endTimeProperty, layers, timeFilterType } = instance.props || {}
  const viewportData =
    (instance.getViewportData?.({ skipTemporalFilter: true }) as FourwingsPointFeature[]) || []
  return (
    getGraphDataFromPoints(viewportData, {
      start: chunk.bufferedStart,
      end: chunk.bufferedEnd,
      interval: chunk.interval || 'MONTH',
      sublayersLength: (layers ?? []).flatMap((l) => l.sublayers).length,
      startTimeProperty: startTimeProperty as string,
      endTimeProperty,
      timeFilterType,
    }) || EMPTY_FRAMES
  )
}

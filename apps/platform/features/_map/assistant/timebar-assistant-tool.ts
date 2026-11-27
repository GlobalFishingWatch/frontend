import type { TrackSegment } from '@globalfishingwatch/api-types'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import type { DeckLayerAtom } from '@globalfishingwatch/deck-layer-composer'
import { deckLayersAtom } from '@globalfishingwatch/deck-layer-composer'
import type {
  FourwingsClustersLayer,
  FourwingsLayer,
  UserPointsTileLayer,
} from '@globalfishingwatch/deck-layers'
import { UserTracksLayer, VesselLayer } from '@globalfishingwatch/deck-layers'
import type { AssistantContextToolOutput } from '@globalfishingwatch/skills/context-tools'
import type { ActivityTimeseriesFrame } from '@globalfishingwatch/timebar'

import {
  selectRealTimeTimerange,
  selectTimebarSelectedDataviews,
  selectTimebarSelectedVisualizationMode,
  selectTimebarUserDataviewsSelected,
} from 'features/_map/timebar/timebar.selectors'
import type { TimebarChunk } from 'features/_map/timebar/timebar-frames'
import {
  getClusterEventsFrames,
  getHeatmapActivityFrames,
  getPointsFrames,
  getTimebarChunk,
} from 'features/_map/timebar/timebar-frames'
import { timerangeState } from 'features/_map/timebar/timerange.hooks'
import {
  selectTimebarGraph,
  selectTimebarVisualisation,
} from 'features/_map/workspace/selectors/app.timebar.selectors'
import { selectIsRealTimeMode } from 'features/_map/workspace/workspace.selectors'
import type { AssistantContextDeps } from 'features/assistant/assistant-context'
import {
  MAX_SERIES_POINTS,
  roundValue,
  summarizeSeries,
} from 'features/assistant/assistant-series.utils'
import type { RootState } from 'store'
import { TimebarVisualisations } from 'types'

/**
 * `get_timebar`: what the timebar graph draws for the current time range, computed when the agent
 * asks with the same functions the graph hooks use (`timebar-frames.ts`), from the deck layers'
 * viewport data. For heatmaps, events and user points that is the value on screen per interval.
 * For vessel and user tracks, speed and depth per day or month, read from the track segments
 * whether or not the speed / depth graph is open.
 */

type GraphFrames = {
  loading: boolean
  interval: string
  /** frame[i] is the value of sublayers[i] */
  sublayers: { id: string; unit?: string }[]
  frames: ActivityTimeseriesFrame[]
}

type GraphParams = {
  state: RootState
  deckLayers: DeckLayerAtom[]
  start: number
  end: number
}

const DAY_MS = 24 * 60 * 60 * 1000

const getLayersById = (deckLayers: DeckLayerAtom[], ids: string[]) =>
  [...new Set(ids)].flatMap((id) => deckLayers.find((layer) => layer.id === id) ?? [])

function getChunk(
  state: RootState,
  dataviews: Parameters<typeof getTimebarChunk>[0]['dataviews'],
  start: number,
  end: number
): TimebarChunk {
  return getTimebarChunk({
    start,
    end,
    dataviews,
    isRealTimeMode: selectIsRealTimeMode(state),
    realTimeTimerange: selectRealTimeTimerange(state),
  })
}

function getHeatmapGraph({ state, deckLayers, start, end }: GraphParams): GraphFrames | undefined {
  const dataviews = selectTimebarSelectedDataviews(state)
  if (!dataviews?.length) {
    return undefined
  }
  const [layer] = getLayersById(deckLayers, [getMergedDataviewId(dataviews)])
  if (!layer) {
    return undefined
  }
  const instance = layer.instance as FourwingsLayer
  const chunk = getChunk(state, dataviews, start, end)
  return {
    loading: !layer.loaded,
    interval: chunk.interval,
    sublayers: instance.props.sublayers.map(({ id, unit }) => ({ id, unit })),
    frames: layer.loaded
      ? getHeatmapActivityFrames(instance, chunk, selectTimebarSelectedVisualizationMode(state))
      : [],
  }
}

function getEventsGraph({ state, deckLayers, start, end }: GraphParams): GraphFrames | undefined {
  const dataviews = selectTimebarSelectedDataviews(state)
  if (!dataviews?.length) {
    return undefined
  }
  const layers = getLayersById(
    deckLayers,
    dataviews.map(({ id }) => id)
  )
  const loaded = layers.length > 0 && layers.every(({ instance }) => instance.isLoaded)
  const chunk = getChunk(state, dataviews, start, end)
  return {
    loading: !loaded,
    interval: chunk.interval,
    sublayers: dataviews.map(({ id }) => ({ id, unit: 'events' })),
    frames: loaded
      ? getClusterEventsFrames(
          layers.map(({ instance }) => instance as FourwingsClustersLayer),
          chunk,
          dataviews.length
        )
      : [],
  }
}

function getPointsGraph({ state, deckLayers, start, end }: GraphParams): GraphFrames | undefined {
  const dataviews = selectTimebarUserDataviewsSelected(state)
  if (!dataviews?.length) {
    return undefined
  }
  const layers = getLayersById(
    deckLayers,
    dataviews.map(({ id }) => id)
  )
  const loaded = layers.length > 0 && layers.every(({ instance }) => instance.isLoaded)
  const chunk = getChunk(state, dataviews, start, end)
  return {
    loading: !loaded,
    interval: chunk.interval || 'MONTH',
    sublayers: dataviews.map(({ id }) => ({ id, unit: 'points' })),
    frames: loaded ? getPointsFrames(layers[0].instance as UserPointsTileLayer, chunk) : [],
  }
}

const GRAPH_BY_VISUALISATION: Partial<
  Record<TimebarVisualisations, (params: GraphParams) => GraphFrames | undefined>
> = {
  [TimebarVisualisations.HeatmapActivity]: getHeatmapGraph,
  [TimebarVisualisations.HeatmapDetections]: getHeatmapGraph,
  [TimebarVisualisations.VesselGroup]: getHeatmapGraph,
  [TimebarVisualisations.Environment]: getHeatmapGraph,
  [TimebarVisualisations.Events]: getEventsGraph,
  [TimebarVisualisations.Points]: getPointsGraph,
}

export function getGraphLayers(graph: GraphFrames, startMs: number, endMs: number) {
  // the chunk is buffered around the time range: only the frames inside it
  const frames = graph.frames.filter(({ date }) => date >= startMs && date < endMs)
  return graph.sublayers.map(({ id, unit }, i) => ({
    id,
    unit,
    ...summarizeSeries(
      frames.map((frame) => ({ date: new Date(frame.date).toISOString(), value: frame[i] ?? 0 }))
    ),
  }))
}

type Bucket = { speeds: number[]; depths: number[] }
/** [date, mean, extreme] */
type Row = [string, number, number]

/** Speed and depth of a track by day, or by month when the range has too many days */
export function getTrackTimeline(segments: TrackSegment[], startMs: number, endMs: number) {
  const byMonth = (endMs - startMs) / DAY_MS > MAX_SERIES_POINTS
  const buckets = new Map<string, Bucket>()
  let trackStart = Infinity
  let trackEnd = -Infinity
  for (const segment of segments) {
    for (const { timestamp, speed, elevation } of segment) {
      if (typeof timestamp !== 'number') continue
      trackStart = Math.min(trackStart, timestamp)
      trackEnd = Math.max(trackEnd, timestamp)
      if (timestamp < startMs || timestamp >= endMs) continue
      const key = new Date(timestamp).toISOString().slice(0, byMonth ? 7 : 10)
      const bucket = buckets.get(key) ?? { speeds: [], depths: [] }
      if (typeof speed === 'number') bucket.speeds.push(speed)
      if (typeof elevation === 'number') bucket.depths.push(elevation)
      buckets.set(key, bucket)
    }
  }
  const mean = (values: number[]) => roundValue(values.reduce((a, v) => a + v, 0) / values.length)
  const entries = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b))
  const speedKnots = entries.flatMap(([date, { speeds }]): Row[] =>
    speeds.length ? [[date, mean(speeds), roundValue(Math.max(...speeds))]] : []
  )
  const depthM = entries.flatMap(([date, { depths }]): Row[] =>
    depths.length ? [[date, mean(depths), roundValue(Math.min(...depths))]] : []
  )
  return {
    ...(Number.isFinite(trackStart) && {
      trackStart: new Date(trackStart).toISOString(),
      trackEnd: new Date(trackEnd).toISOString(),
    }),
    interval: byMonth ? 'month' : 'day',
    ...(speedKnots.length && { speedKnots }),
    ...(depthM.length && { depthM }),
  }
}

function getTracks(deckLayers: DeckLayerAtom[], startMs: number, endMs: number) {
  return deckLayers.flatMap(({ instance, loaded }) => {
    if (instance.props.visible === false) return []
    try {
      if (instance instanceof VesselLayer) {
        return {
          dataviewId: instance.id,
          name: instance.getVesselName(),
          ...(!loaded && { loaded: false as const }),
          ...getTrackTimeline(
            instance.getVesselTrackSegments({ includeMiddlePoints: true }),
            startMs,
            endMs
          ),
        }
      }
      if (instance instanceof UserTracksLayer) {
        return {
          dataviewId: instance.id,
          ...(!loaded && { loaded: false as const }),
          ...getTrackTimeline(instance.getSegments({ includeMiddlePoints: true }), startMs, endMs),
        }
      }
    } catch (e) {
      console.warn('assistant timebar: could not read track', instance.id, e)
    }
    return []
  })
}

export function getTimebar({
  reduxStore,
  jotaiStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_timebar'> {
  const state = reduxStore.getState() as RootState
  const visualisation = selectTimebarVisualisation(state)
  // the timebar range, what the graph draws (the url catches up with it)
  const { start, end } = jotaiStore.get(timerangeState)
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  const deckLayers = jotaiStore.get(deckLayersAtom)
  const graph = GRAPH_BY_VISUALISATION[visualisation]?.({
    state,
    deckLayers,
    start: startMs,
    end: endMs,
  })
  return {
    visualisation,
    timeRange: { start, end },
    ...(graph && {
      interval: graph.interval,
      ...(graph.loading && { loading: true as const }),
      layers: getGraphLayers(graph, startMs, endMs),
    }),
    ...(visualisation === TimebarVisualisations.Vessel && {
      trackGraph: selectTimebarGraph(state),
      tracks: getTracks(deckLayers, startMs, endMs),
    }),
  }
}

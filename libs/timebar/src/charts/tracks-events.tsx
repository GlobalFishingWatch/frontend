import { useCallback, useMemo } from 'react'
import type { Color, PickingInfo, Position } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { PathLayer, PolygonLayer } from '@deck.gl/layers'
import { useSetAtom } from 'jotai'
import type { MjolnirEvent } from 'mjolnir.js'

import { EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { hexToDeckColor } from '@globalfishingwatch/deck-layers'

import type { TrackGraphOrientation } from '../timeline/timeline-context'
import { useTimelineContext } from '../timeline/timeline-context'

import {
  useClusteredChartData,
  useFilteredChartData,
  useOuterScale,
  useSortedChartData,
  useTimebarTimeOrigin,
} from './charts.hooks'
import type {
  TimebarChartChunk,
  TimebarChartData,
  TimebarChartItem,
  TrackChunkProps,
  TrackEventChunkProps,
} from './charts.types'
import { getTrackY } from './charts.utils'
import { hoveredEventState, useUpdateChartLayers, useUpdateChartsData } from './charts-store.atom'

import styles from './tracks-events.module.css'

const MAX_THICK_TRACKS_NUMBER = 2

const WHITE: Color = [255, 255, 255, 255]
const TRANSPARENT: Color = [0, 0, 0, 0]
const BACKGROUND_COLOR: Color = hexToDeckColor('#021236')

const toDeckColor = (color?: string): Color => {
  if (!color || color === 'white') return WHITE
  return hexToDeckColor(color)
}

type EventDatum = {
  eventId: string
  clusterIds?: string[]
  type?: EventTypes
  chunk: TimebarChartChunk<TrackEventChunkProps>
  baseColor: Color
  lineColor: Color
  polygon?: number[][]
  path?: Position[]
  width?: number
}

type LineDatum = { path: Position[]; color: Color }

const getTracksEventsWithCoords = (
  tracksEvents: TimebarChartData<TrackEventChunkProps>,
  origin: number,
  graphHeight: number,
  orientation: TrackGraphOrientation
) => {
  return tracksEvents.map((trackEvents, trackIndex) => {
    const baseTrackY = getTrackY(tracksEvents.length, trackIndex, graphHeight, orientation)
    const trackItemWithCoords: TimebarChartItem<TrackEventChunkProps> = {
      ...trackEvents,
      y: baseTrackY.defaultY,
      chunks: !trackEvents.chunks
        ? []
        : trackEvents.chunks.map((chunk) => {
            const x = chunk.start - origin
            const width = chunk.end ? chunk.end - chunk.start : 0
            return { ...chunk, x, width }
          }),
    }
    return trackItemWithCoords
  })
}

const getTracksWithCoords = (
  tracks: TimebarChartData<TrackChunkProps>,
  origin: number,
  graphHeight: number,
  orientation: TrackGraphOrientation
) => {
  if (!tracks || tracks.length === 0) return []
  return tracks.map((track, trackIndex) => {
    const baseTrackY = getTrackY(tracks.length, trackIndex, graphHeight, orientation)
    return {
      ...track,
      chunks: !track?.chunks
        ? []
        : track.chunks.map((chunk, id) => {
            const x = chunk.start - origin
            const width = chunk.end != null ? chunk.end - chunk.start : 0
            return { ...chunk, id, x, width }
          }),
      y: baseTrackY.defaultY,
      props: { segmentsOffsetY: track?.props?.segmentsOffsetY },
    } as TimebarChartItem<TrackChunkProps>
  })
}

export const TimebarTracksEvents = ({
  data,
  tracks,
  useTrackColor,
  highlightedEventsIds,
  onEventClick,
}: {
  data: TimebarChartData<TrackEventChunkProps>
  tracks?: TimebarChartData<TrackChunkProps>
  useTrackColor?: boolean
  highlightedEventsIds?: string[]
  onEventClick?: (event: TimebarChartChunk<TrackEventChunkProps>) => void
}) => {
  const { graphHeight, trackGraphOrientation, outerWidth } = useTimelineContext()
  const outerScale = useOuterScale()
  const origin = useTimebarTimeOrigin()

  // ms-per-pixel at the current zoom; pan keeps the span (and this) constant.
  const msPerPx = useMemo(() => {
    const [d0, d1] = outerScale.domain()
    return (d1.getTime() - d0.getTime()) / outerWidth
  }, [outerScale, outerWidth])

  const filteredTracks = useFilteredChartData(tracks || [])
  useUpdateChartsData('tracks', filteredTracks)

  const sortedTracksEvents = useSortedChartData(data)
  const clusteredTracksEvents = useClusteredChartData(sortedTracksEvents)
  const filteredTracksEvents = useFilteredChartData(clusteredTracksEvents)
  useUpdateChartsData('tracksEvents', filteredTracksEvents)

  const updateHoveredEvent = useSetAtom(hoveredEventState)

  const lineData = useMemo(() => {
    const tracksWithCoords = getTracksWithCoords(
      filteredTracks,
      origin,
      graphHeight,
      trackGraphOrientation
    )
    const lineHeight = filteredTracks.length > MAX_THICK_TRACKS_NUMBER ? 1 : 2
    const result: LineDatum[] = []
    tracksWithCoords.forEach((track) => {
      const trackColor = toDeckColor(track.color)
      track.chunks.forEach((chunk, i) => {
        const y = track.props?.segmentsOffsetY
          ? track.chunks.length > 8
            ? (track.y || 0) + (i % 3)
            : (track.y || 0) - 5 * (i - (track.chunks.length - 1) / 2)
          : track.y || 0
        if (isNaN(chunk.x as number) || isNaN(chunk.width as number)) return
        result.push({
          path: [
            [chunk.x as number, y],
            [(chunk.x as number) + (chunk.width as number), y],
          ],
          color: chunk.props?.color ? toDeckColor(chunk.props.color) : trackColor,
        })
      })
    })
    return { data: result, lineHeight }
  }, [filteredTracks, origin, graphHeight, trackGraphOrientation])

  const eventGeometry = useMemo(() => {
    const fishing: EventDatum[] = []
    const gapLines: EventDatum[] = []
    const gapIcons: EventDatum[] = []
    const encounters: EventDatum[] = []
    const ports: EventDatum[] = []
    const loitering: EventDatum[] = []

    const tracksEventsWithCoords = getTracksEventsWithCoords(
      filteredTracksEvents,
      origin,
      graphHeight,
      trackGraphOrientation
    )

    const eventSize = Math.round(graphHeight / (tracksEventsWithCoords.length * 2 || 1))
    // Convert a pixel x-offset to ms so it renders back to the same pixel size.
    const toMs = (px: number) => px * msPerPx

    const tracksLen = tracksEventsWithCoords.length
    tracksEventsWithCoords.forEach((trackEvents) => {
      const trackColor = toDeckColor(trackEvents.color)
      const y = trackEvents.y || 0
      trackEvents.chunks.forEach((event) => {
        let colorStr = event.props?.color || 'white'
        if (tracksLen === 1 && event.type === EventTypes.Fishing) {
          colorStr = 'white'
        } else if (useTrackColor || event.type === EventTypes.Fishing) {
          colorStr = trackEvents.color as string
        }
        const baseColor =
          (useTrackColor || event.type === EventTypes.Fishing) && colorStr !== 'white'
            ? trackColor
            : toDeckColor(colorStr)

        const size = Math.min(eventSize, event.type === EventTypes.Fishing ? 4 : 12)
        const x = event.x as number
        const width = event.width as number
        if (isNaN(x) || isNaN(width)) return
        const x2 = x + width

        const meta = {
          eventId: event.id as string,
          clusterIds: event.cluster?.ids,
          type: event.type,
          chunk: event,
          baseColor,
        }

        switch (event.type) {
          case EventTypes.Fishing: {
            fishing.push({
              ...meta,
              lineColor: TRANSPARENT,
              path: [
                [x, y],
                [x2, y],
              ],
              width: size,
            })
            break
          }
          case EventTypes.Gap:
          case EventTypes.Gaps: {
            const h = size / 2
            const hMs = toMs(h)
            gapLines.push({
              ...meta,
              lineColor: TRANSPARENT,
              path: [
                [x + hMs, y],
                [x2, y],
              ],
              width: 2,
            })
            gapIcons.push(
              {
                ...meta,
                lineColor: TRANSPARENT,
                path: [
                  [x - hMs, y - h],
                  [x + hMs, y + h],
                ],
                width: 2,
              },
              {
                ...meta,
                lineColor: TRANSPARENT,
                path: [
                  [x - hMs, y + h],
                  [x + hMs, y - h],
                ],
                width: 2,
              }
            )
            break
          }
          case EventTypes.Port: {
            const w = Math.max(width, toMs(size))
            ports.push({
              ...meta,
              lineColor: BACKGROUND_COLOR,
              polygon: [
                [x, y - size / 2],
                [x + w, y - size / 2],
                [x + w, y + size / 2],
                [x, y + size / 2],
              ],
            })
            break
          }
          case EventTypes.Loitering:
          case EventTypes.Encounter: {
            const w = Math.max(width, toMs(size))
            const xr = x + w
            const capMs = toMs(size / 2)
            const target = event.type === EventTypes.Loitering ? loitering : encounters
            target.push({
              ...meta,
              lineColor: baseColor,
              polygon: [
                [x, y],
                [x + capMs, y - size / 2],
                [xr - capMs, y - size / 2],
                [xr, y],
                [xr - capMs, y + size / 2],
                [x + capMs, y + size / 2],
              ],
            })
            break
          }
        }
      })
    })
    return { fishing, gapLines, gapIcons, encounters, ports, loitering }
  }, [filteredTracksEvents, graphHeight, origin, msPerPx, trackGraphOrientation, useTrackColor])

  // Stable string dep so layers memo doesn't rerun when array reference changes but content is same
  const highlightTrigger = highlightedEventsIds?.join(',')

  const onLayerClick = useCallback(
    (info: PickingInfo, event: MjolnirEvent) => {
      const datum = info.object as EventDatum
      if (datum && onEventClick) {
        event.stopPropagation?.()
        onEventClick(datum.chunk)
      }
    },
    [onEventClick]
  )

  const onLayerHover = useCallback(
    (info: PickingInfo) => {
      updateHoveredEvent((info.object as EventDatum)?.eventId ?? undefined)
    },
    [updateHoveredEvent]
  )

  const layers = useMemo(() => {
    const highlightedSet = new Set(highlightTrigger ? highlightTrigger.split(',') : [])
    const hit = (d: EventDatum) =>
      highlightedSet.has(d.eventId) || (d.clusterIds?.some((id) => highlightedSet.has(id)) ?? false)
    const filledPolygons = [...eventGeometry.encounters, ...eventGeometry.ports]
    return [
      new PathLayer<LineDatum>({
        id: 'tracks-line',
        data: lineData.data,
        widthUnits: 'pixels',
        getPath: (d) => d.path,
        getColor: (d) => d.color,
        getWidth: lineData.lineHeight,
      }),
      new PathLayer<EventDatum>({
        id: 'events-fishing',
        data: eventGeometry.fishing,
        pickable: true,
        capRounded: true,
        jointRounded: true,
        widthUnits: 'pixels',
        getPath: (d) => d.path as Position[],
        getColor: (d) => (hit(d) ? WHITE : d.baseColor),
        updateTriggers: { getColor: highlightTrigger },
        getWidth: (d) => d.width as number,
        onHover: onLayerHover,
        onClick: onLayerClick,
      }),

      new PolygonLayer<EventDatum>({
        id: 'events-filled',
        data: filledPolygons,
        pickable: true,
        stroked: true,
        filled: true,
        lineWidthUnits: 'pixels',
        getPolygon: (d) => d.polygon as number[][],
        getFillColor: (d) => (hit(d) ? WHITE : d.baseColor),
        updateTriggers: { getFillColor: highlightTrigger },
        getLineColor: (d) => d.lineColor,
        getLineWidth: (d) => (d.type === EventTypes.Port ? 1 : 0),
        onHover: onLayerHover,
        onClick: onLayerClick,
      }),
      new PolygonLayer<EventDatum>({
        id: 'events-stroke',
        data: eventGeometry.loitering,
        pickable: true,
        stroked: true,
        filled: false,
        lineWidthUnits: 'pixels',
        getPolygon: (d) => d.polygon as number[][],
        getLineColor: (d) => (hit(d) ? WHITE : d.lineColor),
        updateTriggers: { getLineColor: highlightTrigger },
        getLineWidth: 1.5,
        onHover: onLayerHover,
        onClick: onLayerClick,
      }),
      new PathLayer({
        id: 'events-gap-lines-bg',
        data: eventGeometry.gapLines,
        widthUnits: 'pixels',
        getPath: (d: EventDatum) => d.path as Position[],
        getColor: BACKGROUND_COLOR,
        getWidth: (d: EventDatum) => d.width as number,
      }),
      new PathLayer({
        id: 'events-gap-lines',
        data: eventGeometry.gapLines,
        pickable: true,
        widthUnits: 'pixels',
        getPath: (d: EventDatum) => d.path as Position[],
        getColor: (d) => (hit(d) ? WHITE : d.baseColor),
        getWidth: (d: EventDatum) => d.width as number,
        updateTriggers: { getColor: highlightTrigger },
        getDashArray: [4, 6],
        extensions: [new PathStyleExtension({ dash: true })],
        onHover: onLayerHover,
        onClick: onLayerClick,
      }),
      new PathLayer({
        id: 'events-gap-markers',
        data: eventGeometry.gapIcons,
        pickable: true,
        widthUnits: 'pixels',
        getPath: (d: EventDatum) => d.path as Position[],
        getColor: (d) => (hit(d) ? WHITE : d.baseColor),
        getWidth: (d: EventDatum) => d.width as number,
        updateTriggers: { getColor: highlightTrigger },
        onHover: onLayerHover,
        onClick: onLayerClick,
      }),
    ]
  }, [eventGeometry, lineData, highlightTrigger, onLayerHover, onLayerClick])

  useUpdateChartLayers('tracksEvents', layers)

  const loadingBars = useMemo(() => {
    if (!tracks) return []
    return tracks.flatMap((track, i) => {
      if (track.status !== ResourceStatus.Loading) return []
      const y = getTrackY(tracks.length, i, graphHeight, trackGraphOrientation).defaultY
      const top = track.props?.segmentsOffsetY ? (y || 0) + i : y
      return (
        <div key={i} className={styles.loading} style={{ top }}>
          <div
            className={styles.loadingBar}
            style={{
              backgroundColor: track.color as string,
              animationDelay: `${(i * 0.5) % 2}s`,
            }}
          />
        </div>
      )
    })
  }, [tracks, graphHeight, trackGraphOrientation])

  if (!loadingBars.length) {
    return null
  }
  return (
    <div style={{ position: 'absolute', top: 0, width: outerWidth, height: graphHeight }}>
      {loadingBars}
    </div>
  )
}

import { useContext, useMemo, useRef } from 'react'
import type { Color, OrthographicViewState, PickingInfo, Position } from '@deck.gl/core'
import { OrthographicView } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import { PathLayer, PolygonLayer } from '@deck.gl/layers'
import type { DeckGLRef } from '@deck.gl/react'
import DeckGL from '@deck.gl/react'
import { useSetAtom } from 'jotai'
import type { MjolnirEvent } from 'mjolnir.js'

import { EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { hexToDeckColor } from '@globalfishingwatch/deck-layers'

import type { TimelineScale, TrackGraphOrientation } from '../timelineContext'
import TimelineContext from '../timelineContext'

import {
  useClusteredChartData,
  useFilteredChartData,
  useOuterScale,
  useSortedChartData,
} from './common/hooks'
import type {
  TimebarChartChunk,
  TimebarChartData,
  TimebarChartItem,
  TrackChunkProps,
  TrackEventChunkProps,
} from './common/types'
import { getTrackY } from './common/utils'
import { hoveredEventState, useUpdateChartsData } from './chartsData.atom'
import { MAX_THICK_TRACKS_NUMBER } from './tracks'

import styles from './tracks-events.module.css'

const VIEW = new OrthographicView({ id: '2d-scene', controller: false })

const WHITE: Color = [255, 255, 255, 255]
const TRANSPARENT: Color = [0, 0, 0, 0]
const PORT_STROKE: Color = hexToDeckColor('#021236')

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
  tracksEvents: TimebarChartData<any>,
  outerScale: TimelineScale,
  graphHeight: number,
  orientation: TrackGraphOrientation
) => {
  return tracksEvents.map((trackEvents, trackIndex) => {
    const baseTrackY = getTrackY(tracksEvents.length, trackIndex, graphHeight, orientation)
    const trackItemWithCoords: TimebarChartItem<any> = {
      ...trackEvents,
      y: baseTrackY.defaultY,
      chunks: !trackEvents.chunks
        ? []
        : trackEvents.chunks.map((chunk) => {
            const x = outerScale(chunk.start)
            const x2 = chunk.end ? outerScale(chunk.end) : x
            const width = Math.max(1, x2 - x)
            return { ...chunk, x, width }
          }),
    }
    return trackItemWithCoords
  })
}

const getTracksWithCoords = (
  tracks: TimebarChartData<TrackChunkProps>,
  outerScale: TimelineScale,
  graphHeight: number,
  orientation: TrackGraphOrientation
) => {
  if (!tracks || tracks.length === 0 || !outerScale) return []
  return tracks.map((track, trackIndex) => {
    const baseTrackY = getTrackY(tracks.length, trackIndex, graphHeight, orientation)
    return {
      ...track,
      chunks: !track?.chunks
        ? []
        : track.chunks.map((chunk, id) => {
            const x = outerScale(chunk.start)
            return { ...chunk, id, x, width: outerScale(chunk.end as number) - x }
          }),
      y: baseTrackY.defaultY,
      props: { segmentsOffsetY: track?.props?.segmentsOffsetY },
    } as TimebarChartItem<TrackChunkProps>
  })
}

const TracksEvents = ({
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
  const deckRef = useRef<DeckGLRef>(null)
  const { graphHeight, trackGraphOrientation, innerWidth, outerWidth } = useContext(TimelineContext)
  const outerScale = useOuterScale()

  const veilWidth = (outerWidth - innerWidth) / 2

  const filteredTracks = useFilteredChartData(tracks || [])
  useUpdateChartsData('tracks', filteredTracks)

  const sortedTracksEvents = useSortedChartData(data)
  const clusteredTracksEvents = useClusteredChartData(sortedTracksEvents)
  const filteredTracksEvents = useFilteredChartData(clusteredTracksEvents)
  useUpdateChartsData('tracksEvents', filteredTracksEvents)

  const updateHoveredEvent = useSetAtom(hoveredEventState)

  const tracksEventsWithCoords = useMemo(() => {
    return getTracksEventsWithCoords(
      filteredTracksEvents,
      outerScale,
      graphHeight,
      trackGraphOrientation
    )
  }, [
    filteredTracksEvents,
    outerScale,
    graphHeight,
    trackGraphOrientation,
  ]) as TimebarChartData<TrackEventChunkProps>

  const eventSize = useMemo(
    () => Math.round(graphHeight / (tracksEventsWithCoords.length * 2 || 1)),
    [graphHeight, tracksEventsWithCoords.length]
  )

  const initialViewState = useMemo(
    () =>
      ({
        target: [outerWidth / 2, graphHeight / 2, 0],
        zoom: 0,
      }) as OrthographicViewState,
    [graphHeight, outerWidth]
  )

  const lineData = useMemo(() => {
    const tracksWithCoords = getTracksWithCoords(
      filteredTracks,
      outerScale,
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
  }, [filteredTracks, outerScale, graphHeight, trackGraphOrientation])

  const eventGeometry = useMemo(() => {
    const fishing: EventDatum[] = []
    const gaps: EventDatum[] = []
    const filledPolygons: EventDatum[] = [] // encounter (diamond) + port_visit (rect)
    const strokePolygons: EventDatum[] = [] // loitering (diamond outline)

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

        const s = Math.min(eventSize, event.type === EventTypes.Fishing ? 4 : 12)
        const x = event.x as number
        const width = event.width as number
        if (isNaN(x) || isNaN(width)) return
        const x2 = x + width
        const cx = x + width / 2

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
              width: s,
            })
            break
          }
          case EventTypes.Gap:
          case EventTypes.Gaps: {
            gaps.push({
              ...meta,
              lineColor: TRANSPARENT,
              path: [
                [x, y],
                [x2, y],
              ],
              width: 2,
            })
            break
          }
          case EventTypes.Port: {
            const w = Math.max(width, s)
            filledPolygons.push({
              ...meta,
              lineColor: PORT_STROKE,
              polygon: [
                [x, y - s / 2],
                [x + w, y - s / 2],
                [x + w, y + s / 2],
                [x, y + s / 2],
              ],
            })
            break
          }
          case EventTypes.Loitering: {
            // Elongated hexagon: diamond points at both ends, flat top/bottom spanning duration
            const w = Math.max(width, s)
            const xr = x + w
            strokePolygons.push({
              ...meta,
              lineColor: baseColor,
              polygon: [
                [x, y],
                [x + s / 2, y - s / 2],
                [xr - s / 2, y - s / 2],
                [xr, y],
                [xr - s / 2, y + s / 2],
                [x + s / 2, y + s / 2],
              ],
            })
            break
          }
          case EventTypes.Encounter:
          default: {
            filledPolygons.push({
              ...meta,
              lineColor: TRANSPARENT,
              polygon: [
                [cx - s / 2, y],
                [cx, y - s / 2],
                [cx + s / 2, y],
                [cx, y + s / 2],
              ],
            })
            break
          }
        }
      })
    })
    return { fishing, gaps, filledPolygons, strokePolygons }
  }, [tracksEventsWithCoords, eventSize, useTrackColor])

  // Base, pickable layers. Deliberately NOT dependent on highlightedEventsIds so their
  // instances stay reference-stable across cursor moves — rebuilding them would regenerate
  // deck's picking buffer and make onHover return transient nulls (flickering the tooltip).
  const baseLayers = useMemo(() => {
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
        getColor: (d) => d.baseColor,
        getWidth: (d) => d.width as number,
      }),
      new PathLayer({
        id: 'events-gaps',
        data: eventGeometry.gaps,
        pickable: true,
        widthUnits: 'pixels',
        getPath: (d: EventDatum) => d.path as Position[],
        getColor: (d: EventDatum) => d.baseColor,
        getWidth: (d: EventDatum) => d.width as number,
        getDashArray: [4, 4],
        dashJustified: true,
        extensions: [new PathStyleExtension({ dash: true })],
      }),
      new PolygonLayer<EventDatum>({
        id: 'events-filled',
        data: eventGeometry.filledPolygons,
        pickable: true,
        stroked: true,
        filled: true,
        lineWidthUnits: 'pixels',
        getPolygon: (d) => d.polygon as number[][],
        getFillColor: (d) => d.baseColor,
        getLineColor: (d) => d.lineColor,
        getLineWidth: (d) => (d.type === EventTypes.Port ? 1 : 0),
      }),
      new PolygonLayer<EventDatum>({
        id: 'events-stroke',
        data: eventGeometry.strokePolygons,
        pickable: true,
        stroked: true,
        filled: false,
        lineWidthUnits: 'pixels',
        getPolygon: (d) => d.polygon as number[][],
        getLineColor: (d) => d.lineColor,
        getLineWidth: 1.5,
      }),
    ]
  }, [eventGeometry, lineData])

  const highlightLayers = useMemo(() => {
    const highlightedSet = new Set(highlightedEventsIds || [])
    if (!highlightedSet.size) return []
    const hit = (d: EventDatum) =>
      highlightedSet.has(d.eventId) || (d.clusterIds?.some((id) => highlightedSet.has(id)) ?? false)
    const fishing = eventGeometry.fishing.filter(hit)
    const gaps = eventGeometry.gaps.filter(hit)
    const filled = eventGeometry.filledPolygons.filter(hit)
    const stroke = eventGeometry.strokePolygons.filter(hit)
    return [
      new PathLayer<EventDatum>({
        id: 'events-fishing-hl',
        data: fishing,
        capRounded: true,
        jointRounded: true,
        widthUnits: 'pixels',
        getPath: (d) => d.path as Position[],
        getColor: WHITE,
        getWidth: (d) => d.width as number,
      }),
      new PathLayer({
        id: 'events-gaps-hl',
        data: gaps,
        widthUnits: 'pixels',
        getPath: (d: EventDatum) => d.path as Position[],
        getColor: WHITE,
        getWidth: (d: EventDatum) => d.width as number,
        getDashArray: [4, 4],
        dashJustified: true,
        extensions: [new PathStyleExtension({ dash: true })],
      }),
      new PolygonLayer<EventDatum>({
        id: 'events-filled-hl',
        data: filled,
        stroked: true,
        filled: true,
        lineWidthUnits: 'pixels',
        getPolygon: (d) => d.polygon as number[][],
        getFillColor: WHITE,
        getLineColor: WHITE,
        getLineWidth: (d) => (d.type === EventTypes.Port ? 1 : 0),
      }),
      new PolygonLayer<EventDatum>({
        id: 'events-stroke-hl',
        data: stroke,
        stroked: true,
        filled: false,
        lineWidthUnits: 'pixels',
        getPolygon: (d) => d.polygon as number[][],
        getLineColor: WHITE,
        getLineWidth: 1.5,
      }),
    ]
  }, [eventGeometry, highlightedEventsIds])

  const layers = useMemo(() => [...baseLayers, ...highlightLayers], [baseLayers, highlightLayers])

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

  const onHover = (info: PickingInfo) => {
    const eventId = (info.object as EventDatum)?.eventId
    if (eventId) updateHoveredEvent(eventId)
  }
  const onClick = (info: PickingInfo, event: MjolnirEvent) => {
    const datum = info.object as EventDatum
    if (datum && onEventClick) {
      event.stopPropagation()
      onEventClick(datum.chunk)
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        transform: `translateX(${-veilWidth}px)`,
        width: outerWidth + veilWidth * 2,
        height: graphHeight,
      }}
      onMouseLeave={() => updateHoveredEvent(undefined)}
    >
      {loadingBars}
      <DeckGL
        ref={deckRef}
        views={VIEW}
        initialViewState={initialViewState}
        layers={layers}
        width={outerWidth + veilWidth * 2}
        height={graphHeight}
        pickingRadius={4}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
        onHover={onHover}
        onClick={onClick}
        style={{ position: 'absolute' }}
      />
    </div>
  )
}

export default TracksEvents

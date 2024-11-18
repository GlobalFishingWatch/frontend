import React, { useContext, useMemo, useRef } from 'react'
import DeckGL from '@deck.gl/react'
import { OrthographicView } from '@deck.gl/core'
import { PolygonLayer } from '@deck.gl/layers'
import { useSetAtom } from 'jotai'
import { hexToDeckColor } from '@globalfishingwatch/deck-layers'
import TimelineContext, { TimelineScale, TrackGraphOrientation } from '../timelineContext'
import {
  TimebarChartData,
  TimebarChartItem,
  TrackEventChunkProps,
  TimebarChartChunk,
} from './common/types'
import styles from './tracks-events.module.css'
import {
  useClusteredChartData,
  useFilteredChartData,
  useOuterScale,
  useSortedChartData,
} from './common/hooks'
import { getTrackY } from './common/utils'
import { hoveredEventState, useUpdateChartsData } from './chartsData.atom'

const ICON_MAPPING = {
  encounter: { x: 0, y: 0, width: 36, height: 36 },
  gap: { x: 40, y: 0, width: 36, height: 36, mask: true },
  port_visit: { x: 80, y: 0, width: 36, height: 36 },
  loitering: { x: 120, y: 0, width: 36, height: 36 },
}

const getTracksEventsWithCoords = (
  tracksEvents: TimebarChartData<any>,
  outerScale: TimelineScale,
  graphHeight: number,
  orientation: TrackGraphOrientation
) => {
  // TODO merge with Tracks' getTracksWithCoords
  return tracksEvents.map((trackEvents, trackIndex) => {
    const baseTrackY = getTrackY(tracksEvents.length, trackIndex, graphHeight, orientation)
    const trackItemWithCoords: TimebarChartItem<any> = {
      ...trackEvents,
      y: baseTrackY.defaultY,
      chunks: !trackEvents.chunks
        ? []
        : trackEvents.chunks.map((chunk) => {
            const startX = outerScale(chunk.start)
            const endX = chunk.end ? outerScale(chunk.end) : startX
            const width = Math.max(1, endX - startX)
            return {
              ...chunk,
              x: startX,
              y: baseTrackY.defaultY,
              width,
            }
          }),
    }
    return trackItemWithCoords
  })
}

const TracksEvents = ({
  data,
  useTrackColor,
  highlightedEventsIds,
  onEventClick,
  onEventHover,
}: {
  data: TimebarChartData<TrackEventChunkProps>
  useTrackColor?: boolean
  highlightedEventsIds?: string[]
  onEventClick?: (event: TimebarChartChunk<TrackEventChunkProps>) => void
  onEventHover?: (event?: TimebarChartChunk<TrackEventChunkProps>) => void
}) => {
  const { graphHeight, trackGraphOrientation } = useContext(TimelineContext)
  const outerScale = useOuterScale()
  const containerRef = useRef<HTMLDivElement>(null)

  const sortedTracksEvents = useSortedChartData(data)
  const clusteredTracksEvents = useClusteredChartData(sortedTracksEvents)
  const filteredTracksEvents = useFilteredChartData(clusteredTracksEvents)
  useUpdateChartsData('tracksEvents', filteredTracksEvents)

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

  const updateHoveredEvent = useSetAtom(hoveredEventState)

  const layerData = useMemo(() => {
    return tracksEventsWithCoords.flatMap((trackEvents) =>
      trackEvents.chunks.map((event) => {
        const halfHeight = event.type === 'fishing' ? 1 : 2
        return {
          // Define rectangle vertices (clockwise from top-left)
          polygon: [
            [event.x, event.y - halfHeight],
            [event.x + event.width, event.y - halfHeight],
            [event.x + event.width, event.y + halfHeight],
            [event.x, event.y + halfHeight],
          ],
          id: event.id,
          color:
            useTrackColor || event.type === 'fishing'
              ? trackEvents.color
              : event.props?.color || 'white',
          highlighted: highlightedEventsIds?.includes(event.id as string),
          type: event.type,
        }
      })
    )
  }, [tracksEventsWithCoords, useTrackColor, highlightedEventsIds])

  const layer = new PolygonLayer({
    id: 'events-layer',
    data: layerData,
    getPolygon: (d) => d.polygon,
    getFillColor: (d) => hexToDeckColor(d.color),
    getLineColor: [0, 0, 0, 0], // Transparent border
    pickable: true,
    onClick: ({ object }) => onEventClick?.(object),
    onHover: ({ object }) => {
      updateHoveredEvent(object?.id)
    },
  })

  const view = new OrthographicView({
    id: 'ortho',
    controller: false,
  })

  return (
    <div className={styles.Events} ref={containerRef}>
      <DeckGL
        views={view}
        layers={[layer]}
        initialViewState={{
          target: [(containerRef.current?.clientWidth || 100) / 2, 36, 0],
          zoom: 0,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default TracksEvents

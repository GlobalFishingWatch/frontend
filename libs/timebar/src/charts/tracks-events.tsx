import React, { useContext, useMemo } from 'react'
import cx from 'classnames'
import { useSetAtom } from 'jotai'
import TimelineContext, { TimelineScale, TrackGraphOrientation } from '../timelineContext'
import EncounterIcon from '../icons/events-shapes/encounter.svg'
import LoiteringIcon from '../icons/events-shapes/loitering.svg'
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
            const x = outerScale(chunk.start)
            const x2 = chunk.end ? outerScale(chunk.end) : x
            const width = Math.max(1, x2 - x)
            return {
              ...chunk,
              x,
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

  const trackEvents = useMemo(() => {
    return tracksEventsWithCoords.map((trackEvents, index) => (
      <div
        key={index}
        className={styles.track}
        style={{
          top: `${trackEvents.y}px`,
        }}
      >
        {trackEvents.chunks.map((event) => (
          <div
            key={event.id}
            className={cx(styles.event, styles[event.type || 'none'], {
              [styles.compact]: tracksEventsWithCoords.length >= 5,
              [styles.highlighted]:
                highlightedEventsIds && highlightedEventsIds.includes(event.id as string),
            })}
            style={
              {
                left: `${event.x}px`,
                width: `${event.width}px`,
                '--background-color':
                  useTrackColor || event.type === 'fishing'
                    ? trackEvents.color
                    : event.props?.color || 'white',
              } as React.CSSProperties
            }
            onClick={() => {
              if (onEventClick) onEventClick(event)
            }}
            onMouseEnter={() => {
              updateHoveredEvent(event.id as string)
            }}
            onMouseLeave={() => {
              updateHoveredEvent(undefined)
            }}
          />
        ))}
      </div>
    ))
  }, [
    highlightedEventsIds,
    onEventClick,
    tracksEventsWithCoords,
    updateHoveredEvent,
    useTrackColor,
  ])

  return (
    <div
      className={styles.Events}
      style={
        {
          '--encounterIcon': `url(${EncounterIcon})`,
          '--loiteringIcon': `url(${LoiteringIcon})`,
        } as React.CSSProperties
      }
    >
      {trackEvents}
    </div>
  )
}

export default TracksEvents

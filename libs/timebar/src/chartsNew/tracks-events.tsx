import React, { useContext, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import TimelineContext, { TimelineScale } from '../timelineContext'
import ImmediateContext from '../immediateContext'
import { DEFAULT_CSS_TRANSITION } from '../constants'
import {
  TimebarChartData,
  TimebarChartItem,
  TrackEventChunkProps,
  TimebarChartChunk,
} from './common/types'
import styles from './tracks-events.module.css'
import { useFilteredChartData, useClusteredChartData } from './common/hooks'
import { getTrackY } from './common/utils'

const getTracksEventsWithCoords = (
  tracksEvents: TimebarChartData,
  outerScale: TimelineScale,
  graphHeight: number
) => {
  // TODO merge with Tracks' getTracksWithCoords
  return tracksEvents.map((trackEvents, trackIndex) => {
    const baseTrackY = getTrackY(tracksEvents.length, trackIndex, graphHeight)
    const trackItemWithCoords: TimebarChartItem = {
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
  preselectedEventId,
  onEventClick,
  onEventHover,
}: {
  data: TimebarChartData<TrackEventChunkProps>
  useTrackColor: boolean
  preselectedEventId?: string
  onEventClick: (event: TimebarChartChunk<TrackEventChunkProps>) => void
  onEventHover: (event?: TimebarChartChunk<TrackEventChunkProps>) => void
}) => {
  const { immediate } = useContext(ImmediateContext) as any
  const { outerScale, graphHeight } = useContext(TimelineContext)
  const clusteredTracksEvents = useClusteredChartData(data as TimebarChartData)
  const filteredTracksEvents = useFilteredChartData(clusteredTracksEvents)
  const tracksEventsWithCoords = useMemo(
    () => getTracksEventsWithCoords(filteredTracksEvents, outerScale, graphHeight),
    [filteredTracksEvents, outerScale, graphHeight]
  ) as TimebarChartData<TrackEventChunkProps>

  const [highlightedEvent, setHighlightedEvent] =
    useState<TimebarChartChunk<TrackEventChunkProps> | null>(null)
  const [preselectedEvent, setPreselectedEvent] =
    useState<TimebarChartChunk<TrackEventChunkProps> | null>(null)

  const eventHighlighted = preselectedEvent || highlightedEvent
  // checks if preselectedEventId exist in the first trackEvents, pick it and setHighlightedEvent accordingly
  // TODO should that work on *all* trackEvents?
  useEffect(() => {
    if (preselectedEventId) {
      if (tracksEventsWithCoords && tracksEventsWithCoords.length) {
        const preselectedHighlightedEvent = tracksEventsWithCoords[0].chunks.find(
          (event) => event.id === preselectedEventId
        )
        if (preselectedHighlightedEvent) {
          setPreselectedEvent(preselectedHighlightedEvent)
        } else {
          setPreselectedEvent(null)
        }
      }
    } else {
      setPreselectedEvent(null)
    }
  }, [preselectedEventId, tracksEventsWithCoords])

  return (
    <div className={styles.Events}>
      {tracksEventsWithCoords.map((trackEvents, index) => (
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
                [styles.highlighted]: eventHighlighted && eventHighlighted.id === event.id,
              })}
              style={
                {
                  '--background-color': useTrackColor
                    ? trackEvents.color
                    : event.props?.color || 'white',
                  '--hover-color': useTrackColor ? 'white' : trackEvents.color,
                  left: `${event.x}px`,
                  width: `${event.width}px`,
                  transition: immediate
                    ? 'none'
                    : `left ${DEFAULT_CSS_TRANSITION}, height ${DEFAULT_CSS_TRANSITION}, width ${DEFAULT_CSS_TRANSITION}`,
                } as React.CSSProperties
              }
              onMouseEnter={() => {
                if (!event.cluster) {
                  onEventHover(event)
                }
                setHighlightedEvent(event)
              }}
              onMouseLeave={() => {
                onEventHover()
                setHighlightedEvent(null)
              }}
              onClick={() => onEventClick(event)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default TracksEvents

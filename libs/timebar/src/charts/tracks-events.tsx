import React, { useContext, useMemo } from 'react'
import cx from 'classnames'
import { useSetAtom } from 'jotai'

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
  TrackEventChunkProps,
} from './common/types'
import { getTrackY } from './common/utils'
import { hoveredEventState, useUpdateChartsData } from './chartsData.atom'

import styles from './tracks-events.module.css'

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
}: {
  data: TimebarChartData<TrackEventChunkProps>
  useTrackColor?: boolean
  highlightedEventsIds?: string[]
  onEventClick?: (event: TimebarChartChunk<TrackEventChunkProps>) => void
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
        {trackEvents.chunks.map((event) => {
          let color = event.props?.color || 'white'
          if (tracksEventsWithCoords.length === 1 && event.type === 'fishing') {
            color = 'white'
          } else if (useTrackColor || event.type === 'fishing') {
            color = trackEvents.color as string
          }

          return (
            <div
              role="button"
              tabIndex={0}
              key={event.id}
              className={cx(styles.event, styles[event.type || 'none'], {
                [styles.thick]: tracksEventsWithCoords.length <= 2,
                [styles.compact]: tracksEventsWithCoords.length >= 5,
                [styles.highlighted]:
                  highlightedEventsIds && highlightedEventsIds.includes(event.id as string),
              })}
              style={
                {
                  left: `${event.x}px`,
                  width: `${event.width}px`,
                  '--background-color': color,
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
          )
        })}
      </div>
    ))
  }, [
    highlightedEventsIds,
    onEventClick,
    tracksEventsWithCoords,
    updateHoveredEvent,
    useTrackColor,
  ])

  return <div className={styles.Events}>{trackEvents}</div>
}

export default TracksEvents

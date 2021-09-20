import React, { FC, useContext, useMemo } from 'react'
import { TimelineContext, getTrackY } from '@globalfishingwatch/timebar'
import { RenderedEvent } from '../timebar.selectors'
import styles from './TimebarTracksEvents.module.css'

// height with just one track
const BASE_HEIGHT = 8
const MIN_HEIGHT = 2
const getCoordinates = (
  tracksEvents: TracksEvents,
  outerScale: (value: string | number) => number
) => {
  // const height = Math.max(MIN_HEIGHT, BASE_HEIGHT - tracksEvents.length + 1)
  const height = MIN_HEIGHT
  return tracksEvents.map((trackEvents) => {
    const trackEventsWithCoordinates = trackEvents.map((event) => {
      const x1 = outerScale(event.start)
      const x2 = event.end === null ? x1 : outerScale(event.end)
      const width = Math.max(1, x2 - x1)
      return {
        ...event,
        x1,
        x2,
        width,
        height,
      }
    })
    trackEventsWithCoordinates.sort((eventA, eventB) => eventB.width - eventA.width)
    return trackEventsWithCoordinates
  })
}

type TracksEvents = RenderedEvent[][]

interface TimebarTracksEventsProps {
  tracks: TracksEvents
}

const TimebarTracksEvents: FC<TimebarTracksEventsProps> = ({ tracks }) => {
  console.log(tracks)
  const {
    outerScale,
    outerWidth,
    graphHeight,
    // tooltipContainer,
    // start,
    // end,
    // outerStart,
    // outerEnd,
  } = useContext(TimelineContext)

  const tracksEventsWithCoordinates = useMemo(
    () => getCoordinates(tracks, outerScale),
    [tracks, outerScale]
  )

  return (
    <div style={{ width: `${outerWidth}px`, height: `${graphHeight}px` }}>
      {tracksEventsWithCoordinates.map((trackEvents, index) => (
        <div
          key={index}
          className={styles.track}
          style={{
            top: `${getTrackY(tracks.length, index, graphHeight)}px`,
          }}
        >
          {trackEvents.map((event) => (
            <div
              className={styles.event}
              style={{
                background: '#ff00ff',
                left: `${event.x1}px`,
                width: `${event.width}px`,
                height: `${event.height}px`,
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default TimebarTracksEvents

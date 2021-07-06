import React, { useContext, useState, useMemo, useEffect, Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'
import dayjs from 'dayjs'
import { DEFAULT_CSS_TRANSITION, DEFAULT_FULL_DATE_FORMAT } from '../constants'
import ImmediateContext from '../immediateContext'
import { TimelineContext } from '../components/timeline'
import { ReactComponent as IconEncounter } from '../icons/events/encounter.svg'
import { ReactComponent as IconUnregistered } from '../icons/events/unregistered.svg'
import { ReactComponent as IconLoitering } from '../icons/events/loitering.svg'
import { ReactComponent as IconGap } from '../icons/events/gap.svg'
import { ReactComponent as IconPort } from '../icons/events/port.svg'
import { getTrackY } from './utils'
import styles from './tracks-events.module.css'

const ICONS = {
  encounter: <IconEncounter />,
  unregistered: <IconUnregistered />,
  gap: <IconGap />,
  loitering: <IconLoitering />,
  port: <IconPort />,
  fishing: null,
}

const Tooltip = ({ highlightedEvent, outerScale, innerStartPx, innerEndPx }) => {
  if (!highlightedEvent) {
    return null
  }
  const left = outerScale(highlightedEvent.start)

  if (left < innerStartPx || left > innerEndPx) {
    return null
  }

  const width = highlightedEvent.end === null ? 0 : outerScale(highlightedEvent.end) - left
  const center = left + width / 2

  const start = dayjs(highlightedEvent.start).utc()

  return (
    <div className={styles.tooltip} style={{ left: `${center}px` }} key="tooltip">
      {ICONS[highlightedEvent.type]}
      <div className={styles.tooltipText}>
        <div
          className={styles.tooltipDate}
          style={{ color: highlightedEvent.colorLabels || highlightedEvent.color }}
        >
          {start.format(DEFAULT_FULL_DATE_FORMAT)} UTC
        </div>
        {highlightedEvent.description}
      </div>
    </div>
  )
}

Tooltip.propTypes = {
  highlightedEvent: PropTypes.shape({
    type: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
    color: PropTypes.string,
    colorLabels: PropTypes.string,
    description: PropTypes.string,
  }),
  outerScale: PropTypes.func.isRequired,
  innerStartPx: PropTypes.number.isRequired,
  innerEndPx: PropTypes.number.isRequired,
}

Tooltip.defaultProps = {
  highlightedEvent: null,
}

const getCoordinates = (tracksEvents, outerScale) => {
  return tracksEvents.map((trackEvents) => {
    const trackEventsWithCoordinates = trackEvents.map((event) => {
      if (!outerScale) {
        return event
      }
      const height = event.height
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

/**
  Removes events out of outer delta
 */
const getFilteredEvents = (tracksEvents, outerStart, outerEnd) => {
  const outerStartMs = new Date(outerStart).getTime()
  const outerEndMs = new Date(outerEnd).getTime()
  return tracksEvents.map(trackEvents => {
    const filtered = trackEvents.filter(event => {
      return event.end > outerStartMs && event.start < outerEndMs
    })
    
    console.log(trackEvents.length, filtered.length)
    return filtered
  })
}


const TracksEvents = ({ tracksEvents, preselectedEventId, onEventClick, onEventHover }) => {
  const { immediate } = useContext(ImmediateContext)
  const { outerScale, outerWidth, graphHeight, tooltipContainer, innerStartPx, innerEndPx, outerStart, outerEnd } =
    useContext(TimelineContext)

  const filteredTracksEvents = useMemo(() => getFilteredEvents(tracksEvents, outerStart, outerEnd), [tracksEvents, outerStart, outerEnd])
  
  const tracksEventsWithCoordinates = useMemo(
    () => getCoordinates(filteredTracksEvents, outerScale),
    [filteredTracksEvents, outerScale]
  )
  const [highlightedEvent, setHighlightedEvent] = useState(null)
  const [preselectedEvent, setPreselectedEvent] = useState(null)

  const eventHighlighted = preselectedEvent || highlightedEvent

  // checks if preselectedEventId exist in the first trackEvents, pick it and setHighlightedEvent accordingly
  // TODO should that work on *all* trackEvents?
  useEffect(() => {
    if (preselectedEventId) {
      if (tracksEventsWithCoordinates && tracksEventsWithCoordinates.length) {
        const preselectedHighlightedEvent = tracksEventsWithCoordinates[0].find(
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
  }, [preselectedEventId, tracksEventsWithCoordinates])

  return (
    <Fragment>
      <div width={outerWidth} height={graphHeight} className={styles.Events}>
        {tracksEventsWithCoordinates.map((trackEvents, index) => (
          <div
            key={index}
            className={styles.track}
            style={{
              top: `${getTrackY(tracksEvents.length, index, graphHeight)}px`,
            }}
          >
            {trackEvents.map((event) => (
              <div
                key={event.id}
                className={cx(styles.event, {
                  [styles.highlighted]: eventHighlighted && eventHighlighted.id === event.id,
                })}
                data-type={event.type}
                style={{
                  background: event.color || 'white',
                  left: `${event.x1}px`,
                  width: `${event.width}px`,
                  ...(event.height && { height: `${event.height}px` }),
                  transition: immediate
                    ? 'none'
                    : `left ${DEFAULT_CSS_TRANSITION}, height ${DEFAULT_CSS_TRANSITION}, width ${DEFAULT_CSS_TRANSITION}`,
                }}
                onMouseEnter={() => {
                  onEventHover(event)
                  setHighlightedEvent(event)
                }}
                onMouseLeave={() => {
                  onEventHover()
                  setHighlightedEvent()
                }}
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        ))}
      </div>
      {tooltipContainer &&
        highlightedEvent &&
        ReactDOM.createPortal(
          <Tooltip
            highlightedEvent={highlightedEvent}
            outerScale={outerScale}
            innerStartPx={innerStartPx}
            innerEndPx={innerEndPx}
          />,
          tooltipContainer
        )}
    </Fragment>
  )
}

TracksEvents.propTypes = {
  tracksEvents: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.number,
        end: PropTypes.number,
        id: PropTypes.string,
        type: PropTypes.string,
        color: PropTypes.string,
        colorLabels: PropTypes.string,
        description: PropTypes.string,
      })
    )
  ).isRequired,
  preselectedEventId: PropTypes.string,
  onEventClick: PropTypes.func,
  onEventHover: PropTypes.func,
}

TracksEvents.defaultProps = {
  onEventClick: () => {},
  onEventHover: () => {},
  preselectedEventId: null,
}

export default TracksEvents

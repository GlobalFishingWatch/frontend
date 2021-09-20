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

const Tooltip = ({ highlightedEvent, outerScale, labels }) => {
  if (!highlightedEvent) {
    return null
  }
  const left = outerScale(highlightedEvent.start)

  const width = highlightedEvent.end === null ? 0 : outerScale(highlightedEvent.end) - left
  const center = left + width / 2

  const start = dayjs(highlightedEvent.start).utc()

  const description = highlightedEvent.aggregated
    ? `${highlightedEvent.descriptionGeneric} (${highlightedEvent.aggregatedNum} ${
        labels.events || 'events'
      })`
    : highlightedEvent.description

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
        {description}
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
    descriptionGeneric: PropTypes.string,
    aggregated: PropTypes.bool,
    aggregatedNum: PropTypes.number,
  }),
  outerScale: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    events: PropTypes.string.isRequired,
  }),
}

Tooltip.defaultProps = {
  highlightedEvent: null,
  labels: {
    events: 'events',
  },
}

// height with just one track
const BASE_HEIGHT = 8
const MIN_HEIGHT = 2
const getCoordinates = (tracksEvents, outerScale) => {
  const height = Math.max(MIN_HEIGHT, BASE_HEIGHT - tracksEvents.length + 1)
  return tracksEvents.map((trackEvents) => {
    const trackEventsWithCoordinates = trackEvents.map((event) => {
      if (!outerScale) {
        return event
      }
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
  Cluster events on order to render less nodes, depending on current time delta
*/
const TWO_MONTH_MS = 2 * 31 * 24 * 60 * 60 * 1000
const MIN_FRACTION_INNER_DELTA_TO_CLUSTER = 0.005
const getClusteredEvents = (tracksEvents, innerDeltaMs) => {
  const maxDistanceMs = MIN_FRACTION_INNER_DELTA_TO_CLUSTER * innerDeltaMs
  return tracksEvents.map((trackEvents) => {
    const aggregated = trackEvents.reduce((currentAggregatedEvents, currentEvent) => {
      const lastAggItem = currentAggregatedEvents[currentAggregatedEvents.length - 1]
      const lastType = lastAggItem ? lastAggItem.type : null
      const lastEnd = lastAggItem ? lastAggItem.end : Number.NEGATIVE_INFINITY

      if (currentEvent.start - lastEnd > maxDistanceMs || currentEvent.type !== lastType) {
        // create new agg event
        const newAggEvent = {
          ...currentEvent,
          aggregated: false,
          aggregatedTime: currentEvent.end - currentEvent.start,
          aggregatedNum: 1,
        }
        return [...currentAggregatedEvents, newAggEvent]
      }
      lastAggItem.end = currentEvent.end
      lastAggItem.aggregated = true
      lastAggItem.aggregatedTime += currentEvent.end - currentEvent.start
      lastAggItem.aggregatedNum++
      return currentAggregatedEvents
    }, [])
    return aggregated
  })
}

/**
  Removes events out of outer delta
 */
const getFilteredEvents = (tracksEvents, outerStartMs, outerEndMs) => {
  return tracksEvents.map((trackEvents) => {
    const filtered = trackEvents.filter((event) => {
      return event.end > outerStartMs && event.start < outerEndMs
    })
    return filtered
  })
}

const TracksEvents = ({ labels, tracksEvents, preselectedEventId, onEventClick, onEventHover }) => {
  const { immediate } = useContext(ImmediateContext)
  const {
    outerScale,
    outerWidth,
    graphHeight,
    tooltipContainer,
    start,
    end,
    outerStart,
    outerEnd,
  } = useContext(TimelineContext)

  const startMs = +new Date(start)
  const endMs = +new Date(end)
  const innerDeltaMs = endMs - startMs
  const clusteredTracksEvents = useMemo(() => {
    return innerDeltaMs > TWO_MONTH_MS
      ? getClusteredEvents(tracksEvents, innerDeltaMs)
      : tracksEvents
  }, [tracksEvents, innerDeltaMs])

  const outerStartMs = +new Date(outerStart)
  const outerEndMs = +new Date(outerEnd)
  const filteredTracksEvents = useMemo(
    () => getFilteredEvents(clusteredTracksEvents, outerStartMs, outerEndMs),
    [clusteredTracksEvents, outerStartMs, outerEndMs]
  )

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
                  opacity: 0.5,
                  left: `${event.x1}px`,
                  width: `${event.width}px`,
                  ...(event.height && { height: `${event.height}px` }),
                  transition: immediate
                    ? 'none'
                    : `left ${DEFAULT_CSS_TRANSITION}, height ${DEFAULT_CSS_TRANSITION}, width ${DEFAULT_CSS_TRANSITION}`,
                }}
                onMouseEnter={() => {
                  if (event.aggregated !== true) {
                    onEventHover(event)
                  }
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
          <Tooltip labels={labels} highlightedEvent={highlightedEvent} outerScale={outerScale} />,
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
  labels: PropTypes.shape({
    events: PropTypes.string,
  }),
}

TracksEvents.defaultProps = {
  onEventClick: () => {},
  onEventHover: () => {},
  preselectedEventId: null,
  labels: {
    events: 'events',
  },
}

export default TracksEvents

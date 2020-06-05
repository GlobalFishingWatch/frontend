// DEPRECATED - Still in use in data portal, but use tracks-events instead

import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { DEFAULT_FULL_DATE_FORMAT } from '../constants'
import { ReactComponent as IconEncounter } from '../icons/events/encounter.svg'
import { ReactComponent as IconUnregistered } from '../icons/events/unregistered.svg'
import { ReactComponent as IconGap } from '../icons/events/gap.svg'
import { ReactComponent as IconPort } from '../icons/events/port.svg'
import styles from './vessel-events.module.css'

const ICONS = {
  encounter: <IconEncounter />,
  unregistered: <IconUnregistered />,
  gap: <IconGap />,
  port: <IconPort />,
  fishing: null,
}

const HEIGHTS = {
  port: 6,
  fishing: 5,
  gap: 8,
  encounter: 8,
}

const Layer = React.memo((props) => {
  const { outerScale, events, y, className, children } = props
  return (
    <g transform={`translate(0, ${y})`} className={className}>
      {events.map((event) => {
        const height = HEIGHTS[event.type]
        const x1 = outerScale(event.start)
        const x2 = event.end === null ? x1 : outerScale(event.end)
        const width = Math.max(height, x2 - x1)

        return children({
          style: {
            x1,
            x2,
            width,
          },
          event,
          height,
        })
      })}
    </g>
  )
})

Layer.propTypes = {
  outerScale: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.instanceOf(Date),
      end: PropTypes.instanceOf(Date),
    })
  ).isRequired,
  children: PropTypes.func.isRequired,
  y: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
}

class VesselEvents extends Component {
  getEvents = memoize((events) => {
    return events.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: event.end === null ? null : new Date(event.end),
    }))
  })

  addHighlightInfo = memoize((events, highlightedEventIDs, selectedEventID) => {
    const eventsWithHighlight = events.map((event) => {
      const isHighlighted =
        (highlightedEventIDs !== null && highlightedEventIDs.indexOf(event.id) > -1) ||
        (selectedEventID !== null && selectedEventID === event.id)
      return {
        ...event,
        isHighlighted,
      }
    })

    const highlighted = [
      ...eventsWithHighlight.filter((event) => event.isHighlighted === false),
      ...eventsWithHighlight.filter((event) => event.isHighlighted === true),
    ]

    return highlighted
  })

  filterEvents = memoize((events, outerStart, outerEnd) => {
    let filteredEvents = events

    if (dayjs(outerEnd).diff(dayjs(outerStart), 'day') > 365) {
      filteredEvents = events.filter((event) => event.type !== 'fishing')
    }

    return filteredEvents
  })

  getBackgrounds = memoize((events) =>
    events.filter((event) => event.end !== null).filter((event) => event.type === 'port')
  )

  getLines = memoize((events) => {
    let newEvents = events
      .filter((event) => event.end !== null)
      .filter((event) => ['port', 'track'].includes(event.type))

    // port events have a secondary background line
    newEvents
      .filter((e) => e.type === 'port')
      .forEach((event) => {
        newEvents.push({ ...event, type: 'portBg', id: `${event.id}-bg` })
      })

    newEvents = newEvents.map((event) => ({
      ...event,
      order: ['track', 'portBg', 'port'].indexOf(event.type),
    }))

    newEvents.sort((a, b) => a.order - b.order)

    return newEvents
  })

  getOverlays = memoize((events) => {
    const overlays = []
    events
      .filter((event) => ['port', 'encounter', 'gap', 'fishing'].includes(event.type))
      .forEach((event) => {
        const newEvent = { ...event }
        if (event.type === 'port') {
          if (event.end === null) {
            newEvent.interactive = true
          } else {
            // put another point at event end
            overlays.push({
              ...newEvent,
              start: newEvent.end,
              uid: `${newEvent.id}-end}`,
            })
            newEvent.end = newEvent.start
          }
        }
        overlays.push(newEvent)
      })
    overlays.sort((a, b) => {
      if (a.type === 'fishing' && b.type !== 'fishing') return -1
      else if (a.type !== 'fishing' && b.type === 'fishing') return 1
      return 0
    })
    return overlays
  })

  renderTooltip(events) {
    const { highlightedEventIDs, outerScale } = this.props
    if (highlightedEventIDs === null || highlightedEventIDs.length !== 1) {
      return null
    }
    const highlightedEvent = events.find((event) => event.id === highlightedEventIDs[0])
    if (highlightedEvent === undefined) {
      return null
    }

    const left = outerScale(highlightedEvent.start)
    const width =
      highlightedEvent.end === null || highlightedEvent === undefined
        ? 0
        : outerScale(highlightedEvent.end) - left
    const center = left + width / 2

    const start = dayjs(highlightedEvent.start)
    const duration = highlightedEvent.end ? start.from(dayjs(highlightedEvent.end), true) : null

    let description
    switch (highlightedEvent.type) {
      case 'fishing':
        description = `Fished (${duration})`
        break
      case 'gap':
        description = `Tracking avoidance (${duration})`
        break
      case 'encounter':
        const encounteredVessel = highlightedEvent.encounter.vessel
        const encounteredVesselName =
          encounteredVessel &&
          (encounteredVessel.name || encounteredVessel.ssvid || encounteredVessel.id)
        description =
          encounteredVesselName === undefined || encounteredVesselName === null
            ? 'Had encounter with unnamed vessel'
            : `Had encounter with ${encounteredVesselName}`

        description = `${description} (${duration})`
        break
      case 'port':
        const portName = highlightedEvent.port.name
        description = portName === null ? 'Docked' : `Docked at ${portName}`
        description = `${description} (${duration})`
        break
      default:
    }

    return (
      <div
        className={classNames(styles.tooltip, styles[highlightedEvent.type])}
        style={{ left: center }}
        key="tooltip"
      >
        {ICONS[highlightedEvent.type]}
        <div className={styles.tooltipText}>
          <div className={styles.tooltipDate}>{start.format(DEFAULT_FULL_DATE_FORMAT)}</div>
          {description}
        </div>
      </div>
    )
  }

  render() {
    const {
      events,
      selectedEventID,
      highlightedEventIDs,
      outerStart,
      outerEnd,
      outerWidth,
      graphHeight,
      onEventClick,
      onEventHighlighted,
      tooltipContainer,
    } = this.props

    const preparedEvents = this.addHighlightInfo(
      this.getEvents(events),
      highlightedEventIDs,
      selectedEventID
    )
    const filteredEvents = this.filterEvents(preparedEvents, outerStart, outerEnd)
    const backgrounds = this.getBackgrounds(filteredEvents)
    const lines = this.getLines(filteredEvents)
    const overlays = this.getOverlays(filteredEvents)
    const y = graphHeight / 2
    const tooltip = this.renderTooltip(filteredEvents)

    return (
      <Fragment>
        <svg width={outerWidth} height={graphHeight} className={styles.Events} key="svg">
          <Layer {...this.props} events={backgrounds} className={styles.backgrounds} y={0}>
            {(props) => (
              <g
                key={props.event.id}
                className={classNames(styles[props.event.type], {
                  [styles._highlighted]: props.event.isHighlighted,
                })}
                onMouseEnter={() => onEventHighlighted(props.event)}
                onMouseLeave={() => onEventHighlighted()}
              >
                <rect
                  x={props.style.x1 + HEIGHTS.port / 2}
                  y={0}
                  width={props.style.width}
                  height={graphHeight}
                />
              </g>
            )}
          </Layer>
          <Layer {...this.props} events={lines} className={styles.lines} y={y}>
            {(props) => (
              <line
                key={props.event.id}
                className={styles[props.event.type]}
                y={0}
                x1={props.style.x1}
                x2={props.style.x2}
              />
            )}
          </Layer>
          <Layer {...this.props} events={overlays} className={styles.overlays} y={y}>
            {(props) => (
              <g
                className={classNames(styles[props.event.type], {
                  [styles._highlighted]: props.event.isHighlighted,
                })}
                key={props.event.uid || props.event.id}
                onMouseEnter={() => onEventHighlighted(props.event)}
                onMouseLeave={() => onEventHighlighted()}
                onClick={() => onEventClick(props.event)}
              >
                <rect
                  className={`vessel-event -${props.event.type}`}
                  x={props.style.x1}
                  y={-props.height / 2}
                  width={props.style.width}
                  height={props.height}
                  rx={props.height / 2}
                  ry={props.height / 2}
                  fillOpacity={props.style.fillOpacity}
                />
              </g>
            )}
          </Layer>
        </svg>
        {tooltipContainer && ReactDOM.createPortal(tooltip, tooltipContainer)}
      </Fragment>
    )
  }
}

VesselEvents.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
      id: PropTypes.string,
      type: PropTypes.string,
    })
  ).isRequired,
  outerStart: PropTypes.string.isRequired,
  outerEnd: PropTypes.string.isRequired,
  selectedEventID: PropTypes.string,
  highlightedEventIDs: PropTypes.arrayOf(PropTypes.string),
  outerScale: PropTypes.func.isRequired,
  onEventHighlighted: PropTypes.func,
  onEventClick: PropTypes.func,
  outerWidth: PropTypes.number.isRequired,
  outerHeight: PropTypes.number.isRequired,
  graphHeight: PropTypes.number.isRequired,
  tooltipContainer: PropTypes.instanceOf(Element),
}

VesselEvents.defaultProps = {
  selectedEventID: null,
  highlightedEventIDs: null,
  onEventHighlighted: () => {},
  onEventClick: () => {},
  tooltipContainer: null,
}

export default VesselEvents

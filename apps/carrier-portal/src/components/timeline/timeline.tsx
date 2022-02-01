import React, { Fragment, useState, useEffect, useRef, useMemo, useCallback, memo } from 'react'
import { scaleTime } from 'd3-scale'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import debounce from 'lodash/debounce'
import scrollIntoView from 'scroll-into-view'
import { useSmallScreen } from 'hooks/screen.hooks'
import { formatUTCDate } from 'utils'
import Loader from 'components/loader/loader'
import { Event } from 'types/api/models'
import EventCard from './event-card/event-card'
import styles from './timeline.module.css'

let isRAFTicking = false
const DEBOUNCED_EVENT_TIME = 400

interface TimelineProps {
  events: Event[]
  startDate: string
  endDate: string
  classNames: {
    timeline: string
    events: string
  }
  eventsLoaded: boolean
  isDefaultStartDate: boolean
  timestamp: number | null
  scrollContainerRef: any
  onEventChange: (event: Event | null) => void
}

const Timeline: React.FC<TimelineProps> = memo(function Timeline(props) {
  const {
    events,
    startDate,
    endDate,
    onEventChange,
    classNames,
    timestamp,
    scrollContainerRef,
    eventsLoaded,
    isDefaultStartDate,
  } = props
  const isSmallScreen = useSmallScreen()

  // prepare coordinates (only be events prop changes, so that should mean only at mount)
  const computeCoordinates = useCallback(
    (events: Event[]) => {
      const scale = scaleTime()
        .domain([new Date(endDate), new Date(startDate)])
        .range([0, 1])

      const toNormalized = (date: number | Date) => scale(date) as number
      const toCoord = (normalized: any) => `${normalized * 100}%`
      const computeCoordsForType = (items: any) => {
        return items.map((item: any) => {
          // Using the reverser order as we are showing the latest first
          const startDate = new Date(item.end)
          const endDate = new Date(item.start)
          const startNormalized = toNormalized(startDate)
          const endNormalized = toNormalized(endDate)
          const heightNormalized = Math.abs(startNormalized - endNormalized)
          const middleNormalized = startNormalized + heightNormalized / 2

          return {
            ...item,
            startNormalized,
            endNormalized,
            startCoord: toCoord(startNormalized),
            endCoord: toCoord(endNormalized),
            middleNormalized,
            middleCoord: toCoord(middleNormalized),
            height: toCoord(heightNormalized),
          }
        })
      }
      return computeCoordsForType(events)
    },
    [endDate, startDate]
  )

  // Compute derived data when a new event is highlighted
  const computeScrollCoords = (events: any, selected: number | null) => {
    const currentEvent = events.find((e: any) => e.start === selected)
    const y = currentEvent ? currentEvent.middleCoord : 0

    return { y, currentEvent }
  }

  // this stores DOM elements for events
  const eventRefs = useRef(new Map()).current
  const lastSelected = useRef<number | null>(timestamp)

  // store currently highlighted/selected event in state
  const [selected, setSelected] = useState<number | null>(timestamp || null)

  const getEventByTimestamp = useCallback(
    (timestamp) => events.find((e) => e.start === timestamp),
    [events]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onEventChangeDebounced = useCallback(
    debounce((event: Event | null) => {
      onEventChange(event)
    }, DEBOUNCED_EVENT_TIME),
    [onEventChange]
  )

  // selects an event depending on scroll position
  const checkScroll = useCallback(() => {
    isRAFTicking = false
    const cH = document.documentElement.clientHeight
    const wH = window.innerHeight || 0
    const middle = Math.max(cH, wH) / 2
    let minDelta = Number.POSITIVE_INFINITY
    let selectedEvent: number | null = null
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop !== 0) {
      eventRefs.forEach((el, key) => {
        const { top } = el.getBoundingClientRect()
        const delta = Math.abs(middle - top)
        if (delta < minDelta) {
          selectedEvent = key
          minDelta = delta
        }
      })

      if (lastSelected.current !== selectedEvent) {
        setSelected(selectedEvent)
        const event = getEventByTimestamp(selectedEvent)
        if (event) {
          onEventChangeDebounced(event)
        }
      }
    } else {
      setSelected(null)
      onEventChangeDebounced(null)
    }
  }, [eventRefs, getEventByTimestamp, onEventChangeDebounced, scrollContainerRef])

  const onScroll = useCallback(() => {
    if (isRAFTicking === false) {
      // avoid scroll jank by throttling to frame
      window.requestAnimationFrame(checkScroll)
    }
  }, [checkScroll])

  const scrollToEventId = useCallback(
    (timestamp) => {
      const ref = eventRefs.get(timestamp)

      if (ref) {
        scrollIntoView(ref, {
          align: {
            top: 0.5,
            left: 0,
            leftOffset: 135,
          },
        })
      }
    },
    [eventRefs]
  )

  const setSelectedScroll = useCallback(
    (timestamp) => {
      isRAFTicking = true
      setSelected(timestamp)
      // Timeout to have the new event card size ready
      setTimeout(() => {
        scrollToEventId(timestamp)
        setTimeout(() => {
          isRAFTicking = false
        }, 1000)
      }, 1)
    },
    [scrollToEventId]
  )

  const handleEventClick = useCallback(
    (event) => {
      const timestamp = event.start
      setSelectedScroll(timestamp)
      uaEvent({
        category: 'CVP - Vessel History',
        action: 'Click on an event on the left panel',
        label: event.type,
      })
    },
    [setSelectedScroll]
  )

  useEffect(() => {
    const ref = scrollContainerRef.current
    if (ref !== null) {
      ref.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', onScroll)
      }
    }
  }, [onScroll, scrollContainerRef])

  useEffect(() => {
    if (timestamp !== selected) {
      const event = getEventByTimestamp(timestamp)
      if (event) {
        setSelectedScroll(timestamp)
        onEventChangeDebounced(event)
      }
    }
    // Only needs to update when timestamp changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp])

  useEffect(() => {
    const event = getEventByTimestamp(selected)
    if (event) {
      onEventChange(event)
    }
    // Hack to ensure the encounter vessel track is fetched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsLoaded])

  useEffect(() => {
    if (selected !== lastSelected.current) {
      lastSelected.current = selected
      const event = getEventByTimestamp(selected)
      if (event) {
        onEventChangeDebounced(event)
      }
    }
    // Only needs to update when selected changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEventChangeDebounced, selected])

  useEffect(() => {
    if (eventsLoaded && eventRefs) {
      const ref = eventRefs.get(selected)
      if (ref && scrollContainerRef) {
        const { top } = ref.getBoundingClientRect()

        scrollContainerRef.current.scrollTop = top - window.innerHeight / 2
      }
    }
    // Set current scroll position on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsLoaded])

  const eventsCoords = useMemo(() => computeCoordinates(events), [computeCoordinates, events])
  const scrollCoords = useMemo(() => computeScrollCoords(eventsCoords, selected), [
    eventsCoords,
    selected,
  ])

  return (
    <Fragment>
      <div className={cx(styles.timeline, classNames.timeline)}>
        <div className={styles.futureLine} />
        <div className={styles.currentScroll} style={{ top: scrollCoords.y }}>
          {eventsLoaded && (
            <Fragment>
              <div className={styles.pastLine} />
              <div className={styles.vessel} />
              {selected && (
                <div className={styles.info}>
                  <span>{formatUTCDate(selected)}</span>
                  {scrollCoords.currentEvent && scrollCoords.currentEvent.rfmo && (
                    <label>{scrollCoords.currentEvent.rfmo.label}</label>
                  )}
                </div>
              )}
            </Fragment>
          )}
        </div>
        <div className={styles.eventsColumn}>
          {!isSmallScreen &&
            eventsCoords.map((event: any) => (
              <button
                className={cx(styles.eventBtn, styles[event.type], {
                  [styles.highlighted]: event.start === selected,
                  [styles.partially]:
                    event.encounter && event.encounter.authorizationStatus === 'partially',
                  [styles.unmatched]:
                    event.encounter && event.encounter.authorizationStatus === 'unmatched',
                  [styles.past]: !selected || event.start <= selected,
                })}
                style={{
                  top: event.startCoord,
                  height: event.height,
                }}
                key={event.id}
                title={formatUTCDate(event.start)}
                onClick={() => handleEventClick(event)}
              />
            ))}
        </div>
      </div>
      <ul className={cx(styles.events, classNames.events)}>
        {eventsLoaded === false ? (
          <Loader />
        ) : (
          <Fragment>
            {eventsCoords.map((event: any) => {
              const highlighted = event.start === selected
              const past = !selected || event.start <= selected
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  eventRefs={eventRefs}
                  past={past}
                  highlighted={highlighted}
                  onClick={handleEventClick}
                />
              )
            })}
            {eventsCoords.length > 0 && (
              <span className={styles.endOfTimeline}>
                {`You've reached the start date of ${
                  isDefaultStartDate ? 'the dataset' : 'your time range filter'
                }`}
              </span>
            )}
          </Fragment>
        )}
      </ul>
    </Fragment>
  )
})

export default Timeline

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import formatcoords from 'formatcoords'
import { DateTime } from 'luxon'
import { IconButton } from '@globalfishingwatch/ui-components'
import { ApiEvent } from '@globalfishingwatch/api-types/dist/events'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import ActivityModalContent from 'features/profile/components/activity/ActivityModalContent'
import ActivityDate from 'features/profile/components/activity/ActivityDate'
import { cheapDistance } from 'utils/vessel'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import { selectFilteredEventsByVoyages } from 'features/vessels/voyages/voyages.selectors'
import { EventTypeVoyage } from 'types/voyage'
import { Range } from 'types'
import { selectHighlightedEvent, setHighlightedEvent, setVoyageTime } from '../map.slice'
import styles from './Info.module.css'

interface InfoProps {
  onEventChange: (event: RenderedEvent, pitch: number, bearing: number, padding: number) => void
}

const Info: React.FC<InfoProps> = (props): React.ReactElement => {
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const eventsWithVoyages = useSelector(selectFilteredEventsByVoyages)
  const { getVoyageByEvent } = useVoyagesConnect()
  const events: RenderedEvent[] = useMemo(
    () => eventsWithVoyages.filter((event) => event.type !== EventTypeVoyage.Voyage),
    [eventsWithVoyages]
  ) as RenderedEvent[]

  const eventsMap: string[] = useMemo(() => events.map((e) => e.id), [events])
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent | undefined>(undefined)
  const [prevDisabled, setPrevDisabled] = useState(false)
  const [nextDisabled, setNextDisabled] = useState(false)

  const changeVesselEvent = useCallback(
    (actualEventId, direction) => {
      const actualEventIndex = eventsMap.indexOf(actualEventId.id)
      const nextPosition = direction === 'prev' ? actualEventIndex + 1 : actualEventIndex - 1
      setPrevDisabled(nextPosition <= eventsMap.length)
      setNextDisabled(nextPosition >= 0)
      if (nextPosition >= 0 && nextPosition < eventsMap.length) {
        const nextEvent = events[nextPosition]
        dispatch(setHighlightedEvent({ id: eventsMap[nextPosition] } as ApiEvent))
        const voyage = getVoyageByEvent(nextEvent)
        if (voyage) {
          dispatch(
            setVoyageTime({
              start: DateTime.fromMillis(voyage.start).toUTC().toISO(),
              end: DateTime.fromMillis(voyage.end).toUTC().toISO(),
            } as Range)
          )
        }
        const distance = Math.floor(
          cheapDistance(nextEvent.position, events[actualEventIndex].position) * 10
        )
        const pitch = Math.min(distance * 4, 60)
        const bearing =
          Math.atan2(
            nextEvent.position.lon - events[actualEventIndex].position.lon,
            nextEvent.position.lat - events[actualEventIndex].position.lat
          ) *
          pitch *
          -1
        props.onEventChange(nextEvent, pitch, bearing, height)
      }
    },
    [dispatch, events, eventsMap, getVoyageByEvent, height, props]
  )

  useEffect(() => {
    const event = events.find((e) => e.id === highlightedEvent?.id)
    if (event) {
      setSelectedEvent(event)
    } else {
      setSelectedEvent(undefined)
    }
  }, [highlightedEvent, events])

  useMemo(() => {
    if (highlightedEvent) {
      const actualEventIndex = eventsMap.indexOf(highlightedEvent.id)
      setPrevDisabled(actualEventIndex === eventsMap.length)
      setNextDisabled(actualEventIndex === 0)
    }
  }, [eventsMap, highlightedEvent])

  return (
    <Fragment>
      {selectedEvent && (
        <div
          className={cx(styles.infoContainer, expanded ? styles.expanded : '')}
          ref={(el) => {
            if (!el) return
            setHeight(el.clientHeight)
          }}
        >
          <div className={cx(styles.footer, styles.panel)}>
            <div className={styles.eventSelector}>
              <IconButton
                icon="arrow-left"
                disabled={prevDisabled}
                type={prevDisabled ? 'invert' : 'map-tool'}
                size="small"
                onClick={() => changeVesselEvent(highlightedEvent, 'prev')}
              ></IconButton>
              <span className={styles.coords}>
                {formatcoords(selectedEvent.position.lat, selectedEvent.position.lon).format(
                  'DDMMssX',
                  {
                    latLonSeparator: ' ',
                    decimalPlaces: 2,
                  }
                )}
              </span>
              <IconButton
                icon="arrow-right"
                disabled={nextDisabled}
                type={nextDisabled ? 'invert' : 'map-tool'}
                size="small"
                onClick={() => changeVesselEvent(highlightedEvent, 'next')}
              ></IconButton>
            </div>
            <div className={styles.footerArea}>
              <div className={styles.footerAreaContent}>
                <div className={styles.footerAreaTitle}>
                  <div className={styles.eventData}>
                    <ActivityDate event={selectedEvent} className={styles.dateFormat} />
                    <div className={styles.description}>{selectedEvent.description}</div>
                  </div>
                  <div className={styles.switcher}>
                    <IconButton
                      size="small"
                      icon={expanded ? 'close' : 'info'}
                      type="border"
                      onClick={() => setExpanded(!expanded)}
                    ></IconButton>
                  </div>
                </div>
                <ActivityModalContent event={selectedEvent}></ActivityModalContent>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Info

import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import formatcoords from 'formatcoords'

import { IconButton } from '@globalfishingwatch/ui-components'

import ActivityDate from 'features/profile/components/activity/ActivityDate'
import ActivityModalContent from 'features/profile/components/activity/ActivityModalContent'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { selectFilteredEventsByVoyages } from 'features/vessels/voyages/voyages.selectors'
import type { Voyage } from 'types/voyage';
import { EventTypeVoyage } from 'types/voyage'
import { cheapDistance } from 'utils/vessel'

import { selectHighlightedEvent } from '../map.slice'
import useMapEvents from '../map-events.hooks'

import styles from './Info.module.css'

interface InfoProps {
  onEventChange: (event: RenderedEvent, pitch: number, bearing: number, padding: number) => void
}

const Info: React.FC<InfoProps> = (props): React.ReactElement<any> => {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const eventsWithVoyages = useSelector(selectFilteredEventsByVoyages) as (RenderedEvent | Voyage)[]

  const events: RenderedEvent[] = useMemo(
    () => eventsWithVoyages.filter((event) => event.type !== EventTypeVoyage.Voyage),
    [eventsWithVoyages]
  ) as RenderedEvent[]

  const eventsMap: string[] = useMemo(() => events.map((e) => e.id), [events])
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const { highlightEvent } = useMapEvents()

  const currentEventIndex = useMemo(
    () => eventsMap.indexOf(highlightedEvent?.id ?? ''),
    [eventsMap, highlightedEvent?.id]
  )

  const { prevDisabled, nextDisabled } = useMemo(() => {
    return {
      prevDisabled: !highlightedEvent || currentEventIndex === eventsMap.length - 1,
      nextDisabled: !highlightedEvent || currentEventIndex === 0,
    }
  }, [currentEventIndex, eventsMap.length, highlightedEvent])

  const changeVesselEvent = useCallback(
    (direction) => {
      const nextPosition = direction === 'prev' ? currentEventIndex + 1 : currentEventIndex - 1
      if (nextPosition >= 0 && nextPosition < eventsMap.length) {
        const nextEvent = events[nextPosition]
        highlightEvent(nextEvent)

        const distance = Math.floor(
          cheapDistance(nextEvent.position, events[currentEventIndex].position) * 10
        )
        const pitch = Math.min(distance * 4, 60)
        const bearing =
          Math.atan2(
            nextEvent.position.lon - events[currentEventIndex].position.lon,
            nextEvent.position.lat - events[currentEventIndex].position.lat
          ) *
          pitch *
          -1
        props.onEventChange(nextEvent, pitch, bearing, height)
      }
    },
    [currentEventIndex, events, eventsMap.length, height, highlightEvent, props]
  )

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === highlightedEvent?.id),
    [events, highlightedEvent?.id]
  )

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
                onClick={() => changeVesselEvent('prev')}
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
                onClick={() => changeVesselEvent('next')}
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

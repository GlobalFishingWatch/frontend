import { Fragment, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'

//import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityModalContent from 'features/vessel/activity/modals/ActivityModalContent'
import { DEFAULT_VIEWPORT } from 'data/config'
import { ActivityEvent } from 'types/activity'
import useActivityEventConnect from '../event/event.hook'
import { useActivityByType } from './activity-by-type.hook'
import styles from './activity-by-type.module.css'
import { selectEventsByType } from './activity-by-type.selectors'
import ActivityItem from './ActivityItem'
import ActivityGroup from './ActivityGroup'

export interface ActivityByTypeProps {
  onMoveToMap?: () => void
}

export function ActivityByType({ onMoveToMap = () => {} }: ActivityByTypeProps) {
  const { toggleEventType, eventTypes, expandedGroup } = useActivityByType()
  const events = useSelector(selectEventsByType)
  const { t } = useTranslation()
  const { getEventDescription } = useActivityEventConnect()
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent>()
  const openModal = useCallback((event: ActivityEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const onToggleEventType = useCallback(
    (event) => {
      toggleEventType(event)
      uaEvent({
        category: 'Vessel Detail ACTIVITY BY TYPE Tab',
        action: 'View list of events by activity type',
        label: JSON.stringify({ type: event }),
      })
    },
    [toggleEventType]
  )
  const closeModal = useCallback(() => setIsOpen(false), [])
  const { viewport, setMapCoordinates } = useViewport()

  const selectEventOnMap = useCallback(
    (event: ActivityEvent) => {
      setMapCoordinates({
        latitude: event.position.lat,
        longitude: event.position.lon,
        zoom: viewport.zoom ?? DEFAULT_VIEWPORT.zoom,
      })

      onMoveToMap()
    },
    [onMoveToMap, setMapCoordinates, viewport.zoom]
  )

  const getEventTypeHeight = (eventType: EventType) => {
    return eventType === EventTypes.Port ? 60 : 51
  }

  const getContainerHeight = (eventType: EventType) => {
    return getEventTypeHeight(eventType) * 10 // create a frame of 10 events
  }

  const getRowHeight = useCallback(
    (index: number) => {
      if (!expandedGroup) return 0
      const height = getEventTypeHeight(expandedGroup)
      return height
    },
    [expandedGroup]
  )

  const displayOptions = { displayPortVisitsAsOneEvent: true }

  const listOfEvents = useMemo(() => {
    if (!expandedGroup) {
      return []
    }
    return events[expandedGroup]?.events
  }, [events, expandedGroup])

  return (
    <div className={styles.activityContainer}>
      <Modal
        appSelector="__next"
        title={getEventDescription(selectedEvent)}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
      {eventTypes.map((eventType) => (
        <Fragment key={eventType}>
          {events[eventType] && (
            <ActivityGroup
              eventType={eventType}
              loading={events[eventType].loading}
              onToggleClick={onToggleEventType}
              quantity={events[eventType].quantity}
              expanded={expandedGroup === eventType}
            ></ActivityGroup>
          )}
          {false &&
            expandedGroup === eventType &&
            events[eventType]?.events.length &&
            events[eventType]?.events.map((event) => (
              <ActivityItem
                key={event.id}
                event={event}
                onMapClick={selectEventOnMap}
                onInfoClick={openModal}
                options={displayOptions}
              />
            ))}
          {expandedGroup === eventType && events[eventType]?.events.length && (
            <AutoSizer disableHeight={true}>
              {({ width, height }) => (
                <List
                  key={`${events[eventType]?.events.length}-list`}
                  width={width as number}
                  height={getContainerHeight(eventType)}
                  itemCount={events[eventType]?.events.length}
                  itemData={events[eventType]?.events}
                  itemSize={getRowHeight}
                >
                  {({ index, style }) => {
                    const event = events[eventType].events[index]
                    return (
                      <div style={style}>
                        <ActivityItem
                          key={event.id}
                          event={event}
                          onMapClick={selectEventOnMap}
                          onInfoClick={openModal}
                          options={displayOptions}
                        />
                      </div>
                    )
                  }}
                </List>
              )}
            </AutoSizer>
          )}
        </Fragment>
      ))}
    </div>
  )
}

export default ActivityByType

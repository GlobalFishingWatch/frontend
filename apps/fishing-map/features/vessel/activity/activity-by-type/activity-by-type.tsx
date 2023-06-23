import { Suspense, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { useTranslation } from 'react-i18next'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { EventTypes } from '@globalfishingwatch/api-types'
import {
  RenderedEvent,
  //selectHighlightEventIds,
} from 'features/vessel/activity/vessels-activity.selectors'
import { EventTypeVoyage, Voyage } from 'types/voyage'
//import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityGroup from 'features/vessel/activity/ActivityGroup'
import DataAndTerminology from 'features/vessel/data-and-terminology/DataAndTerminology'
import ActivityDataAndTerminology from 'features/vessel/activity/ActivityDataAndTerminology'
import ActivityItem from 'features/vessel/activity/ActivityItem'
import ActivityModalContent from 'features/vessel/activity/modals/ActivityModalContent'
import { DEFAULT_VIEWPORT } from 'data/config'
import { useActivityByType } from './activity-by-type.hook'
import styles from './activity-by-type.module.css'

export interface ActivityByTypeProps {
  onMoveToMap?: () => void
}

export function ActivityByType({ onMoveToMap = () => {} }: ActivityByTypeProps) {
  const { events, toggleEventType } = useActivityByType()
  const { t } = useTranslation()

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
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
  //const { highlightEvent, highlightVoyage } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()
  //const highlightsIds = useSelector(selectHighlightEventIds)

  const selectEventOnMap = useCallback(
    (event: RenderedEvent | Voyage) => {
      if (event.type === EventTypeVoyage.Voyage) {
        //highlightVoyage(event)
      } else {
        //highlightEvent(event)

        setMapCoordinates({
          latitude: event.position.lat,
          longitude: event.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VIEWPORT.zoom,
        })
      }

      onMoveToMap()
    },
    [onMoveToMap, setMapCoordinates, viewport.zoom]
  )

  const getRowHeight = useCallback(
    (index: number) => {
      const event = events[index]
      const height = !event.group && event?.type === 'port_visit' ? (event?.subEvent ? 35 : 44) : 60
      return height
    },
    [events]
  )
  console.log(events)
  const displayOptions = { displayPortVisitsAsOneEvent: true }
  if (!events.length) {
    return <p>asdasd</p>
  }
  return (
    <div className={styles.activityContainer}>
      <Modal
        appSelector="__next"
        title={selectedEvent?.description ?? ''}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
      {events.length &&
        events.map((event) =>
          event.group ? (
            <ActivityGroup
              key={event.type}
              eventType={event.type}
              loading={event.loading}
              onToggleClick={onToggleEventType}
              quantity={event.quantity}
              status={event.status}
            ></ActivityGroup>
          ) : (
            <ActivityItem
              key={event.id}
              event={event}
              highlighted={false}
              onMapClick={selectEventOnMap}
              onInfoClick={openModal}
              options={displayOptions}
            />
          )
        )}
    </div>
  )
}

export default ActivityByType

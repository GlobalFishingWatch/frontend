import React, { Fragment, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { VesselWithHistory } from 'types'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import ActivityFilters from 'features/profile/filters/ActivityFilters'
import { fetchPsmaThunk } from 'features/psma/psma.slice'
import {
  EventTypeVoyage,
  selectFilteredEventsByVoyages,
} from 'features/vessels/voyages/voyages.selectors'
import { t } from 'features/i18n/i18n'
import { setHighlightedEvent } from 'features/map/map.slice'
import { useLocationConnect } from 'routes/routes.hook'
import ActivityItem from './ActivityItem'
import ActivityModalContent from './ActivityModalContent'
import styles from './Activity.module.css'
import { RenderedVoyage } from './ActivityVoyage'
interface ActivityProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
  onMoveToMap: () => void
}

const Activity: React.FC<ActivityProps> = (props): React.ReactElement => {
  const dispatch = useDispatch()

  const eventsLoading = useSelector(selectResourcesLoading)
  const eventsList = useSelector(selectFilteredEventsByVoyages)
  const [expandedVoyages, setExpandedVoyages] = useState<
    Record<number, RenderedVoyage | undefined>
  >([])

  const toggleVoyage = useCallback(
    (voyage: RenderedVoyage) => {
      setExpandedVoyages({
        ...expandedVoyages,
        [voyage.timestamp]: expandedVoyages[voyage.timestamp] ? undefined : voyage,
      })
    },
    [expandedVoyages]
  )

  const events: (RenderedEvent | RenderedVoyage)[] = useMemo(() => {
    return eventsList
      .map((event) => {
        if (event.type === 'voyage') {
          return {
            ...event,
            status: expandedVoyages[event.timestamp] ? 'expanded' : 'collapsed',
          } as RenderedVoyage
        } else {
          return event as RenderedEvent
        }
      })
      .filter((event) => {
        return (
          (event.type === 'voyage' && event.visible) ||
          Object.values(expandedVoyages).find(
            (voyage) =>
              voyage !== undefined &&
              // event timestamp or start is inside the voyage
              voyage.start <= (event.timestamp ?? event.start) &&
              voyage.end >= (event.timestamp ?? event.start)
          )
        )
      })
  }, [eventsList, expandedVoyages])

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  const { dispatchQueryParams } = useLocationConnect()
  const selectEventOnMap = useCallback(
    (event: RenderedEvent) => {
      dispatch(setHighlightedEvent({ id: event.id } as ApiEvent))
      dispatchQueryParams({ latitude: event.position.lat, longitude: event.position.lon })
      props.onMoveToMap()
    },
    [dispatch, dispatchQueryParams, props]
  )

  useEffect(() => {
    const [lastVoyage] = events.filter((event) => event.type === EventTypeVoyage.Voyage)
    if (lastVoyage)
      setExpandedVoyages({
        [(lastVoyage as RenderedVoyage).timestamp]: lastVoyage as RenderedVoyage,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(fetchRegionsThunk())
    dispatch(fetchPsmaThunk())
  }, [dispatch])

  return (
    <div className={styles.activityContainer}>
      <ActivityFilters></ActivityFilters>
      {eventsLoading && <Spinner className={styles.spinnerFull} />}
      {!eventsLoading && (
        <Fragment>
          <Modal title={selectedEvent?.description ?? ''} isOpen={isModalOpen} onClose={closeModal}>
            {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
          </Modal>
          <div className={styles.activityContainer}>
            {events && events.length > 0 ? (
              <AutoSizer disableWidth={true}>
                {({ width, height }) => (
                  <List
                    width={width}
                    height={height}
                    itemCount={events.length}
                    itemData={events}
                    itemSize={() => 79}
                  >
                    {({ index, style }) => {
                      const event = events[index]
                      return (
                        <div style={style}>
                          <ActivityItem
                            key={index}
                            event={event}
                            onToggleClick={(voyage) => toggleVoyage(voyage)}
                            onMapClick={(event) => selectEventOnMap(event)}
                            onInfoClick={(event) => openModal(event)}
                          />
                        </div>
                      )
                    }}
                  </List>
                )}
              </AutoSizer>
            ) : (
              <p>{t('events.noResults', 'No events found. Try changing the current filters.')}</p>
            )}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Activity

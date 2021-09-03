import React, { Fragment, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { VesselWithHistory } from 'types'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import ActivityFilters from 'features/profile/filters/ActivityFilters'
import { fetchPsmaThunk } from 'features/psma/psma.slice'
import { selectFilteredEventsByVoyages } from 'features/vessels/voyages/voyages.selectors'
import ActivityItem from './ActivityItem'
import ActivityModalContent from './ActivityModalContent'
import styles from './Activity.module.css'
import { RenderedVoyage } from './ActivityVoyage'
interface ActivityProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
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
        [voyage.start]: expandedVoyages[voyage.start] ? undefined : voyage,
      })
    },
    [expandedVoyages]
  )

  const events: (RenderedEvent | RenderedVoyage)[] = useMemo(() => {
    // let voyagesRanges = []
    console.log(expandedVoyages)
    return eventsList
      .map((event) => {
        if (event.type === 'voyage') {
          return {
            ...event,
            status: expandedVoyages[event.start] ? 'expanded' : 'collapsed',
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
              ((voyage.start < event.start && (voyage.end ?? new Date().getTime()) > event.start) ||
                (voyage.start <= (event as RenderedEvent).end &&
                  (voyage.end ?? new Date().getTime()) >= (event as RenderedEvent).end))
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
                            onInfoClick={(event) => openModal(event)}
                          />
                        </div>
                      )
                    }}
                  </List>
                )}
              </AutoSizer>
            ) : (
              <p>No events results, try change the filters</p>
            )}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Activity

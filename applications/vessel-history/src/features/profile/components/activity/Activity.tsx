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
  const [expandedVoyages, setExpandedVoyages] = useState<string[]>([])

  const toggleVoyage = useCallback(
    (voyage: RenderedVoyage) => {
      const start = `${voyage.start ?? 0}`
      const index = expandedVoyages.indexOf(start)
      if (index >= 0) {
        setExpandedVoyages(expandedVoyages.filter((item) => item !== start))
      } else {
        setExpandedVoyages(expandedVoyages.concat([start]))
      }
    },
    [expandedVoyages]
  )

  const events: (RenderedEvent | RenderedVoyage)[] = useMemo(() => {
    // let voyagesRanges = []
    return eventsList.map((event) => {
      if (event.type === 'voyage') {
        return {
          ...event,
          status: expandedVoyages.includes(`${event.start}`) ? 'expanded' : 'collapsed',
        } as RenderedVoyage
      } else {
        return event as RenderedEvent
      }
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

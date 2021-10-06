import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import { VesselWithHistory } from 'types'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import ActivityFilters from 'features/profile/filters/ActivityFilters'
import { fetchPsmaThunk } from 'features/psma/psma.slice'
import { EventTypeVoyage, RenderedVoyage, Voyage } from 'types/voyage'
import { t } from 'features/i18n/i18n'
import { setHighlightedEvent } from 'features/map/map.slice'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import useViewport from 'features/map/map-viewport.hooks'
import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import { selectVesselId } from 'routes/routes.selectors'
import ActivityItem from './ActivityItem'
import ActivityModalContent from './ActivityModalContent'
import styles from './Activity.module.css'
interface ActivityProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
  onMoveToMap: () => void
}

const Activity: React.FC<ActivityProps> = (props): React.ReactElement => {
  const dispatch = useDispatch()

  const {
    eventsLoading,
    events,
    toggleVoyage,
  }: {
    eventsLoading: boolean
    events: (RenderedEvent | RenderedVoyage)[]
    toggleVoyage: (voyage: RenderedVoyage) => void
  } = useVoyagesConnect()

  const { setMapCoordinates } = useViewport()
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  const selectEventOnMap = useCallback(
    (event: RenderedEvent | Voyage) => {
      // TODO Define what's the expected behavior when clicking a voyage map icon
      if (event.type === EventTypeVoyage.Voyage) return

      dispatch(setHighlightedEvent({ id: event.id } as ApiEvent))
      setMapCoordinates({
        latitude: event.position.lat,
        longitude: event.position.lon,
        zoom: DEFAULT_VESSEL_MAP_ZOOM,
        bearing: 0,
        pitch: 0,
      })
      props.onMoveToMap()
    },
    [dispatch, props, setMapCoordinates]
  )
  const isGFWVessel = useSelector(selectVesselId)
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
                    itemSize={() => 60}
                  >
                    {({ index, style }) => {
                      const event = events[index]
                      return (
                        <div style={style}>
                          <ActivityItem
                            key={index}
                            event={event}
                            onToggleClick={toggleVoyage}
                            onMapClick={selectEventOnMap}
                            onInfoClick={openModal}
                          />
                        </div>
                      )
                    }}
                  </List>
                )}
              </AutoSizer>
            ) : (
              <div>
                {isGFWVessel && <p className={styles.emptyState}>{t('events.noResults', 'No events found. Try changing the current filters.')}</p>}
                {!isGFWVessel && <p className={styles.emptyState}>{t('events.noData', 'There are no events for this vessel since data is coming only from the source = “Other”. Try searching using MMSI to match also with AIS source.')}</p>}
              </div>
            )}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Activity

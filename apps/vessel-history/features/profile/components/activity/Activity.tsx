import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import type { VesselWithHistory } from 'types'

import { Modal, Spinner } from '@globalfishingwatch/ui-components'

import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import { t } from 'features/i18n/i18n'
import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityFilters from 'features/profile/filters/ActivityFilters'
import type {
  RenderedEvent} from 'features/vessels/activity/vessels-activity.selectors';
import {
  selectHighlightEventIds,
} from 'features/vessels/activity/vessels-activity.selectors'
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook'
import { selectVesselId } from 'routes/routes.selectors'
import type { Voyage } from 'types/voyage';
import { EventTypeVoyage } from 'types/voyage'

import ActivityItem from './ActivityItem'
import ActivityModalContent from './ActivityModalContent'

import styles from './Activity.module.css'

interface ActivityProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
  onMoveToMap: () => void
}

const Activity: React.FC<ActivityProps> = (props): React.ReactElement<any> => {
  const { eventsLoading, events, toggleVoyage } = useVoyagesConnect()
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const { highlightEvent, highlightVoyage } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()
  const highlightsIds = useSelector(selectHighlightEventIds)

  const selectEventOnMap = useCallback(
    (event: RenderedEvent | Voyage) => {
      if (event.type === EventTypeVoyage.Voyage) {
        highlightVoyage(event)
      } else {
        highlightEvent(event)

        setMapCoordinates({
          latitude: event.position.lat,
          longitude: event.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VESSEL_MAP_ZOOM,
          bearing: 0,
          pitch: 0,
        })
      }

      props.onMoveToMap()
    },
    [highlightEvent, highlightVoyage, props, setMapCoordinates, viewport.zoom]
  )
  const isGFWVessel = useSelector(selectVesselId)

  return (
    <div className={styles.activityContainer}>
      <ActivityFilters></ActivityFilters>
      {eventsLoading && <Spinner className={styles.spinnerFull} />}
      {!eventsLoading && (
        <Fragment>
          <Modal
            appSelector="__next"
            title={selectedEvent?.description ?? ''}
            isOpen={isModalOpen}
            onClose={closeModal}
          >
            {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
          </Modal>
          <div className={styles.activityContainer}>
            {events && events.length > 0 ? (
              <AutoSizer disableWidth={true}>
                {(params: any) => (
                  <List
                    width={params.width}
                    height={params.height}
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
                            highlighted={
                              event.type !== EventTypeVoyage.Voyage && highlightsIds[event.id]
                            }
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
                {isGFWVessel && (
                  <p className={styles.emptyState}>
                    {t('events.noResults', 'No events found. Try changing the current filters.')}
                  </p>
                )}
                {!isGFWVessel && (
                  <p className={styles.emptyState}>
                    {t(
                      'events.noData',
                      'There are no events for this vessel since data is coming only from the source = “Other”. Try searching using MMSI to match also with AIS source.'
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Activity

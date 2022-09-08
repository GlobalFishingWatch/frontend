import { Suspense, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { Button, Modal, Spinner } from '@globalfishingwatch/ui-components'
import { useNavigatorOnline } from '@globalfishingwatch/react-hooks'
import { DEFAULT_VESSEL_MAP_ZOOM, RISK_SUMMARY_SETTINGS } from 'data/config'
import {
  RenderedEvent,
  selectHighlightEventIds,
} from 'features/vessels/activity/vessels-activity.selectors'
import { EventTypeVoyage, Voyage } from 'types/voyage'
import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityGroup from 'features/profile/components/activity/ActivityGroup'
import AisCoverage from 'features/profile/components/activity/AisCoverage'
import useRiskIndicator from 'features/risk-indicator/risk-indicator.hook'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import ActivityDataAndTerminology from 'features/profile/components/activity/ActivityDataAndTerminology'
import FiltersLabel from 'features/filters-label/filters-label'
import { Filters } from 'features/event-filters/filters.slice'
import { useUser } from 'features/user/user.hooks'
import { selectCurrentOfflineVessel } from 'features/vessels/offline-vessels.selectors'
import ActivityItem from '../profile/components/activity/ActivityItem'
import ActivityModalContent from '../profile/components/activity/ActivityModalContent'
import { useActivityByType } from './activity-by-type.hook'
import styles from './activity-by-type.module.css'

export interface ActivityByTypeProps {
  onMoveToMap?: () => void
}

export function ActivityByType({ onMoveToMap = () => {} }: ActivityByTypeProps) {
  const { t } = useTranslation()

  const { events, toggleEventType } = useActivityByType()

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const { authorizedIdentityIndicators } = useUser()
  const { coverage, eventsLoading } = useRiskIndicator(authorizedIdentityIndicators)
  const closeModal = useCallback(() => setIsOpen(false), [])
  const { highlightEvent, highlightVoyage } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()
  const highlightsIds = useSelector(selectHighlightEventIds)
  const { online } = useNavigatorOnline()
  const offlineVessel = useSelector(selectCurrentOfflineVessel)

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

      onMoveToMap()
    },
    [highlightEvent, highlightVoyage, onMoveToMap, setMapCoordinates, viewport.zoom]
  )

  const filters: Partial<Filters> = useMemo(() => {
    const endDate =
      (!online && offlineVessel?.savedOn && DateTime.fromISO(offlineVessel.savedOn)) ||
      DateTime.now()
    const startDate = endDate.minus(RISK_SUMMARY_SETTINGS.timeRange)

    return {
      start: startDate.toUTC().toISO(),
      end: endDate.toUTC().toISO(),
    }
  }, [offlineVessel.savedOn, online])

  return (
    <div className={styles.activityContainer}>
      <Suspense fallback={<Spinner className={styles.spinnerFull} />}>
        <Modal
          appSelector="__next"
          title={selectedEvent?.description ?? ''}
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
        </Modal>

        <div className={styles.heading}>
          <AisCoverage value={eventsLoading ? null : coverage?.percentage} />
          <div className={styles.headingButtons}>
            <DataAndTerminology
              containerClassName={styles.dataAndTerminologyContainer}
              size="medium"
              type="solid"
              title={t('common.dataAndTerminology', 'Data and Terminology')}
            >
              <ActivityDataAndTerminology />
            </DataAndTerminology>

            <Button type="secondary" className={styles.filterBtn}>
              <FiltersLabel filters={filters} />
            </Button>
          </div>
        </div>
        <div className={styles.activityContainer}>
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
                  if (event.group)
                    return (
                      <div style={style}>
                        <ActivityGroup
                          key={index}
                          eventType={event.type}
                          loading={event.loading}
                          onToggleClick={toggleEventType}
                          quantity={event.quantity}
                          status={event.status}
                        ></ActivityGroup>
                      </div>
                    )
                  else
                    return (
                      <div style={style}>
                        <ActivityItem
                          key={index}
                          event={event}
                          highlighted={highlightsIds[event.id]}
                          onMapClick={selectEventOnMap}
                          onInfoClick={openModal}
                        />
                      </div>
                    )
                }}
              </List>
            )}
          </AutoSizer>
        </div>
      </Suspense>
    </div>
  )
}

export default ActivityByType

import React, { Suspense, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'

import { EventTypes } from '@globalfishingwatch/api-types'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'

import { DEFAULT_VESSEL_MAP_ZOOM, IS_STANDALONE_APP } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import DateRangeLabel from 'features/date-range-label/date-range-label'
import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityDataAndTerminology from 'features/profile/components/activity/ActivityDataAndTerminology'
import ActivityGroup from 'features/profile/components/activity/ActivityGroup'
import AisCoverage from 'features/profile/components/activity/AisCoverage'
import useRiskIndicator from 'features/risk-indicator/risk-indicator.hook'
import { useUser } from 'features/user/user.hooks'
import type {
  RenderedEvent} from 'features/vessels/activity/vessels-activity.selectors';
import {
  selectHighlightEventIds,
} from 'features/vessels/activity/vessels-activity.selectors'
import type { Voyage } from 'types/voyage';
import { EventTypeVoyage } from 'types/voyage'

import ActivityItem from '../profile/components/activity/ActivityItem'
import ActivityModalContent from '../profile/components/activity/ActivityModalContent'

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
      trackEvent({
        category: TrackCategory.VesselDetailActivityByTypeTab,
        action: 'View list of events by activity type',
        label: JSON.stringify({ type: event }),
      })
    },
    [toggleEventType]
  )
  const { authorizedIdentityIndicators } = useUser()
  const { coverage, eventsLoading } = useRiskIndicator(authorizedIdentityIndicators)
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

      onMoveToMap()
    },
    [highlightEvent, highlightVoyage, onMoveToMap, setMapCoordinates, viewport.zoom]
  )

  const getRowHeight = useCallback(
    (index: number) => {
      const event = events[index]
      const height = !event.group && event?.type === 'port_visit' ? (event?.subEvent ? 35 : 44) : 60
      return height
    },
    [events]
  )

  const displayOptions = { displayPortVisitsAsOneEvent: true }

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
          {!IS_STANDALONE_APP && <AisCoverage value={coverage?.percentage} />}
          <div className={styles.headingButtons}>
            <DataAndTerminology
              containerClassName={styles.dataAndTerminologyContainer}
              size="medium"
              type="solid"
              title={t('common.dataAndTerminology', 'Data and Terminology')}
            >
              <ActivityDataAndTerminology />
            </DataAndTerminology>
            <DateRangeLabel type="secondary" className={styles.filterBtn} />
          </div>
        </div>
        <div className={styles.activityContainer}>
          <AutoSizer disableWidth={true}>
            {(params: any) => (
              <List
                /**
                 * The `key` prop is needed here to force the List clear the cache of row heigths
                 * when the length of the events changes (eg: collapsing/expanding events groups)
                 * otherwise the variable row heights are not recalculated inside VariableSizeList
                 */
                key={`${events.length}-list`}
                width={params.width}
                height={params.height}
                itemCount={events.length}
                itemData={events}
                itemSize={getRowHeight}
              >
                {({ index, style }) => {
                  const event = events[index]
                  if (event.group && (event.type !== EventTypes.Gap || !IS_STANDALONE_APP)) {
                    return (
                      <div style={style}>
                        <ActivityGroup
                          key={index}
                          eventType={event.type}
                          loading={event.loading}
                          onToggleClick={onToggleEventType}
                          quantity={event.quantity}
                          status={event.status}
                        ></ActivityGroup>
                      </div>
                    )
                  } else if (event.type !== EventTypes.Gap || !IS_STANDALONE_APP) {
                    return (
                      <div style={style}>
                        <ActivityItem
                          key={index}
                          event={event}
                          highlighted={highlightsIds[event.id]}
                          onMapClick={selectEventOnMap}
                          onInfoClick={openModal}
                          options={displayOptions}
                        />
                      </div>
                    )
                  }
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

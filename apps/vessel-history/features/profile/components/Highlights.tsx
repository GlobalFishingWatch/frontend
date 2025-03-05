import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import cx from 'classnames'

import { EventTypes } from '@globalfishingwatch/api-types'
import { Button, Icon, IconButton, Modal, Spinner } from '@globalfishingwatch/ui-components'

import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import type {
  RenderedEvent} from 'features/vessels/activity/vessels-activity.selectors';
import {
  selectEventsLoading,
  selectFilteredActivityHighlightEvents,
} from 'features/vessels/activity/vessels-activity.selectors'
import { selectAnyHighlightsSettingDefined } from 'features/vessels/activity/vessels-highlight.selectors'
import { SETTINGS } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import type { Voyage } from 'types/voyage';
import { EventTypeVoyage } from 'types/voyage'

import ActivityItem from './activity/ActivityItem'
import ActivityModalContent from './activity/ActivityModalContent'

import styles from './activity/Activity.module.css'

interface HighlightsProps {
  onMoveToMap: () => void
}

const Highlights: React.FC<HighlightsProps> = (props): React.ReactElement<any> => {
  const { t } = useTranslation()
  const anyHighlightsSettingDefined = useSelector(selectAnyHighlightsSettingDefined)
  const events = useSelector(selectFilteredActivityHighlightEvents)
  const loading = useSelector(selectEventsLoading)
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const closeModal = useCallback(() => setIsOpen(false), [])
  const { dispatchLocation } = useLocationConnect()
  const { highlightEvent } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()

  const openModal = useCallback((event: RenderedEvent, index: number) => {
    setSelectedEvent(event)
    setIsOpen(true)
    trackEvent({
      category: TrackCategory.HighlightEvents,
      action: 'Select one vessel from highlights section',
      label: JSON.stringify({
        position: index,
        click: 'info',
      }),
    })
  }, [])

  const onMapClick = useCallback(
    (event: RenderedEvent | Voyage, index: number) => {
      trackEvent({
        category: TrackCategory.HighlightEvents,
        action: 'Select one vessel from highlights section',
        label: JSON.stringify({
          position: index,
          click: 'map',
        }),
      })
      if (event.type !== EventTypeVoyage.Voyage) {
        highlightEvent(event)

        setMapCoordinates({
          latitude: event.position.lat,
          longitude: event.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VESSEL_MAP_ZOOM,
          bearing: 0,
          pitch: 0,
        })

        props.onMoveToMap()
      }
    },
    [highlightEvent, props, setMapCoordinates, viewport.zoom]
  )

  const onSettingsClick = useCallback(() => {
    dispatchLocation(SETTINGS)
    trackEvent({
      category: TrackCategory.HighlightEvents,
      action: 'Start highlight events configurations',
      label: JSON.stringify({
        page: 'vessel detail',
      }),
    })
  }, [dispatchLocation])

  const countEvents = useMemo(() => {
    if (events.length) {
      const countEvents = {
        [EventTypes.Port as string]: 0,
        [EventTypes.Fishing as string]: 0,
        [EventTypes.Loitering as string]: 0,
        [EventTypes.Encounter as string]: 0,
      }
      events.forEach((event) => countEvents[event.type as string]++)
      return countEvents
    }
    return null
  }, [events])

  useEffect(() => {
    if (countEvents) {
      trackEvent({
        category: TrackCategory.HighlightEvents,
        action: 'Display highlight events',
        label: JSON.stringify(countEvents),
      })
    }
  }, [countEvents])

  return (
    <div
      className={cx(styles.activityContainer, styles.highlightsContainer, {
        [styles.noData]: !anyHighlightsSettingDefined || (events && events.length === 0),
      })}
    >
      <div className={styles.divider}></div>
      <div className={styles.settingsLinkContainer}>
        <IconButton
          onClick={onSettingsClick}
          className={styles.settingsLink}
          type="default"
          size="default"
          icon="settings"
        />
        <h2 className={styles.highlights}>
          {t('events.activityHighlights', 'Activity Highlights')}
          {anyHighlightsSettingDefined &&
            !loading &&
            events &&
            events.length > 0 &&
            ` (${events.length})`}
        </h2>
      </div>
      {!anyHighlightsSettingDefined && (
        <div className={styles.noSettingsContainer}>
          {t(
            'events.noHighlitingSettingsMessage',
            "You've not defined the highlight settings yet. " +
              'Please click Settings to configure the activity of interest.'
          )}
          <Button type="secondary" onClick={onSettingsClick} className={styles.settings}>
            <Icon type="default" icon="settings" className={styles.iconInButton}></Icon>
            {t('events.highlitingSettings', 'settings')}
          </Button>
        </div>
      )}
      {anyHighlightsSettingDefined && (
        <Fragment>
          {(loading || !events) && <Spinner className={styles.spinnerMed} />}
          {!loading && (
            <Fragment>
              <Modal
                appSelector="__next"
                title={selectedEvent?.description ?? ''}
                isOpen={isModalOpen}
                onClose={closeModal}
              >
                {selectedEvent && (
                  <ActivityModalContent event={selectedEvent}></ActivityModalContent>
                )}
              </Modal>
              <div className={cx(styles.activityListContainer, styles.highlightsListContainer)}>
                {events && events.length > 0 && (
                  <AutoSizer disableWidth={false}>
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
                                onInfoClick={() => openModal(event, index)}
                                onMapClick={() => onMapClick(event, index)}
                              />
                            </div>
                          )
                        }}
                      </List>
                    )}
                  </AutoSizer>
                )}
                {events && events.length === 0 && (
                  <div>
                    {t('events.noHighlights', 'No events found for your highlighting criteria')}
                  </div>
                )}
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default Highlights

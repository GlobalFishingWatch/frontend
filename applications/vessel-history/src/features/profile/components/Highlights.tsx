import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { Button, Icon, IconButton, Modal, Spinner } from '@globalfishingwatch/ui-components'
import { EventTypes } from '@globalfishingwatch/api-types'
import { SETTINGS } from 'routes/routes'
import {
  RenderedEvent,
  selectEventsLoading,
  selectFilteredActivityHighlightEvents,
} from 'features/vessels/activity/vessels-activity.selectors'
import { selectAnyHighlightsSettingDefined } from 'features/vessels/activity/vessels-highlight.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import { EventTypeVoyage, Voyage } from 'types/voyage'
import ActivityModalContent from './activity/ActivityModalContent'
import ActivityItem from './activity/ActivityItem'
import styles from './activity/Activity.module.css'

interface HighlightsProps {
  onMoveToMap: () => void
}

const Highlights: React.FC<HighlightsProps> = (props): React.ReactElement => {
  const { t } = useTranslation()
  const anyHighlightsSettingDefined = useSelector(selectAnyHighlightsSettingDefined)
  const events = useSelector(selectFilteredActivityHighlightEvents)
  const loading = useSelector(selectEventsLoading)
  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const { dispatchLocation } = useLocationConnect()
  const { highlightEvent } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()

  const onSettingsClick = useCallback(() => {
    dispatchLocation(SETTINGS)
    uaEvent({
      category: 'Highlight Events',
      action: 'Start highlight events configurations',
      label: JSON.stringify({
        page: 'vessel detail',
      }),
    })
  }, [dispatchLocation])

  const selectEventOnMap = useCallback(
    (event: RenderedEvent | Voyage) => {
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

  useEffect(() => {
    if (!loading) {
      const countEvents = {
        [EventTypes.Port as string]: 0,
        [EventTypes.Fishing as string]: 0,
        [EventTypes.Loitering as string]: 0,
        [EventTypes.Encounter as string]: 0,
      }
      events.forEach((event) => countEvents[event.type as string]++)
      uaEvent({
        category: 'Highlight Events',
        action: 'Display highlight events',
        label: JSON.stringify(countEvents),
      })
    }
  }, [events, loading])

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
                                onInfoClick={openModal}
                                onMapClick={selectEventOnMap}
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

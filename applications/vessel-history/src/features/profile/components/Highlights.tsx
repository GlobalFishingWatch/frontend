import React, { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import Link from 'redux-first-router-link'
import { Button, Icon, IconButton, Modal, Spinner } from '@globalfishingwatch/ui-components'
import { useAppDispatch } from 'features/app/app.hooks'
import { SETTINGS } from 'routes/routes'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { useActivityHighlightsConnect } from 'features/vessels/activity/vessel-highlight.hooks'
import ActivityModalContent from './activity/ActivityModalContent'
import ActivityItem from './activity/ActivityItem'
import styles from './activity/Activity.module.css'

const Highlights: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const {
    highlightedEvents: events,
    highlightsSettingDefined: anyHighlightsSettingDefined,
    loading,
  } = useActivityHighlightsConnect()

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const navigateToSettings = useCallback(() => dispatch({ type: SETTINGS }), [dispatch])

  return (
    <div
      className={cx(
        styles.activityContainer,
        styles.highlightsContainer,
        !anyHighlightsSettingDefined || (events && events.length === 0) ? styles.noData : {}
      )}
    >
      <div className={styles.divider}></div>
      <div>
        <Link className={styles.settingsLink} to={['settings']}>
          <IconButton type="default" size="default" icon="settings"></IconButton>
        </Link>
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
          <Button type="secondary" onClick={navigateToSettings} className={styles.settings}>
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
                                onInfoClick={(event) => openModal(event)}
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

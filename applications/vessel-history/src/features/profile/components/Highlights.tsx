import React, { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { Modal, Spinner } from '@globalfishingwatch/ui-components'
import { selectActivityHighlightEvents } from 'features/vessels/activity/vessels-highlight.selectors'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import ActivityModalContent from './activity/ActivityModalContent'
import ActivityItem from './activity/ActivityItem'
import styles from './activity/Activity.module.css'

// interface HighlightsProps {
//   vessel?: VesselWithHistory
// }

const Highlights: React.FC = (): React.ReactElement => {
  const { t } = useTranslation()
  const eventsLoading = useSelector(selectResourcesLoading)
  const events = useSelector(selectActivityHighlightEvents)

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  return (
    <div className={cx(styles.activityContainer, styles.highlightsContainer)}>
      <div className={styles.divider}></div>
      <h2 className={styles.highlights}>
        Activity Highlights {!eventsLoading && `(${events.length})`}
      </h2>
      {eventsLoading && <Spinner className={styles.spinnerFull} />}
      {!eventsLoading && (
        <Fragment>
          <Modal title={selectedEvent?.description ?? ''} isOpen={isModalOpen} onClose={closeModal}>
            {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
          </Modal>
          <div className={styles.activityContainer}>
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
              <div className={styles.noEvents}>
                {t('events.noHighlights', 'No events found for your highlighting criteria')}
              </div>
            )}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Highlights

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { DateTime } from 'luxon'
import { IconButton, Modal } from '@globalfishingwatch/ui-components'
import { VesselWithHistory } from 'types'
import { selectVesselId } from 'routes/routes.selectors'
import { fetchVesselActivityThunk } from 'features/vessels/activity/vessels-activity.thunk'
import { selectVesselActivity, toggleGroup } from 'features/vessels/activity/vessels-activity.slice'
import { ActivityEventGroup, ActivityEventType } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import styles from './Activity.module.css'
import ActivityDate from './ActivityDate'
import ActivityDescription from './description/ActivityDescription'
import ActivityGroupDescription from './description/ActivityGroupDescription'
import ActivityModalContent from './ActivityModalContent'
interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Activity: React.FC<InfoProps> = (props): React.ReactElement => {
  const vesselId = useSelector(selectVesselId)

 
  const dispatch = useDispatch()
  useEffect(() => {
    if (vesselId) {
      const start = '2013-01-01'
      const end = '2021-07-01'
      dispatch(fetchVesselActivityThunk({vesselId, start, end}))
    }
  }, [dispatch, vesselId])

  const onOpenGroup = useCallback((index: number) => {
    dispatch(toggleGroup({index}))
  },[dispatch])

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ActivityEventType>()
  const openModal = useCallback((event: ActivityEventType) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    dispatch(fetchRegionsThunk())
  }, [dispatch])
  
  const eventGroups = useSelector(selectVesselActivity)
  console.log(eventGroups)
  return (
    <Fragment>
      <Modal
        title={selectedEvent ? <ActivityDescription event={selectedEvent} ></ActivityDescription> : ''}
        isOpen={isModalOpen}
         onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
      <div className={styles.activityContainer}>
        {eventGroups && eventGroups.map((group: ActivityEventGroup, groupIndex) => ( 
          <Fragment key={groupIndex}>
            {!group.open && group.entries && ( 
              <Fragment>
                  <div className={styles.event} >
                    <div className={cx(styles.eventIcon, styles[group.event_type])}>
                      <i></i>
                      <span className={styles.eventCount}>{group.entries.length}</span>
                    </div>
                    <div className={styles.eventData}>
                      <div className={styles.date}>
                        <I18nDate date={group.start} format={DateTime.DATE_SHORT} /> - 
                        <I18nDate date={group.end} format={DateTime.DATE_SHORT} />
                      </div>
                      <div className={styles.description}>
                        <ActivityGroupDescription  group={group} ></ActivityGroupDescription>
                      </div>
                      
                    </div>
                    {group.entries.length > 1 && ( 
                      <div className={styles.actions}>
                        <IconButton icon="compare" size="small" onClick={() => onOpenGroup(groupIndex)}></IconButton>
                      </div>
                    )}
                  </div>
                <div className={styles.divider}></div>
              </Fragment>
            )}
            {group.open && group.entries && group.entries.map((event: ActivityEventType, eventIndex) => ( 
              <Fragment key={eventIndex}>
                  <div className={styles.event} >
                    <div className={cx(styles.eventIcon, styles[group.event_type])}>
                      <i></i>
                    </div>
                    <div className={styles.eventData}>
                      <ActivityDate event={event}/>
                      <div className={styles.description}>
                        <ActivityDescription event={event} ></ActivityDescription>
                      </div>
                      
                    </div>

                    <div className={styles.actions}>
                      <IconButton icon="info" size="small" onClick={() => openModal(event)}></IconButton>
                      <IconButton icon="view-on-map" size="small"></IconButton>
                    </div>

                  </div>
                <div className={styles.divider}></div>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </Fragment>
  )
}

export default Activity
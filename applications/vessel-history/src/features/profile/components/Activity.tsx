import React, { Fragment, useEffect, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { VesselWithHistory } from 'types'
import { selectCurrentOfflineVessel } from 'features/vessels/offline-vessels.selectors'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { OfflineVessel } from 'types/vessel'
import {
  selectDataset,
  selectTmtId,
  selectVesselId,
  selectVesselProfileId,
} from 'routes/routes.selectors'
import { fetchVesselActivityThunk } from 'features/vessels/activity/vessels-activity.thunk'
import { selectVesselActivity } from 'features/vessels/activity/vessels-activity.slice'
import { ActivityEvent, ActivityEventGroup } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import InfoField, { VesselFieldLabel } from './InfoField'
import styles from './Activity.module.css'
import ActivityDate from './ActivityDate'

interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Activity: React.FC<InfoProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const vesselId = useSelector(selectVesselId)
  const vesselTmtId = useSelector(selectTmtId)
  const vesselDataset = useSelector(selectDataset)
  const vesselProfileId = useSelector(selectVesselProfileId)
  const offlineVessel = useSelector(selectCurrentOfflineVessel)
  const { dispatchCreateOfflineVessel, dispatchDeleteOfflineVessel, dispatchFetchOfflineVessel } =
    useOfflineVesselsAPI()
 
  const dispatch = useDispatch()
  useEffect(() => {
    if (vesselId) {
      console.log(vesselId)
      dispatch(fetchVesselActivityThunk({vesselId}))
    }
  }, [dispatch, vesselId])

  const eventGroups = useSelector(selectVesselActivity)
  console.log(eventGroups)
  return (
    <Fragment>
      <div className={styles.activityContainer}>
        {eventGroups && eventGroups.map((group: ActivityEventGroup, groupIndex) => ( 
          <Fragment key={groupIndex}>
            {group.entries && group.entries.map((event: ActivityEvent, eventIndex) => ( 
              <Fragment key={eventIndex}>
                  <div className={styles.event} >
                    <div>
                      <i className={styles.eventIcon}></i>
                    </div>
                    <div className={styles.eventData}>
                      <ActivityDate event={event}/>
                      <div className={styles.description}>
                        Fishing in ????
                      </div>
                      
                    </div>
                    {group.entries.length > 1 && ( 
                      <div className={styles.actions}>
                        <IconButton icon="info" size="small"></IconButton>
                        <IconButton icon="view-on-map" size="small"></IconButton>
                      </div>
                    )}
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

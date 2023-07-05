import React, { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { EventVessel } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import AuthIcon from 'features/vessel/auth-icon/AuthIcon'
import { ActivityEvent } from 'types/activity'
import ActivityContentField from './ActivityContentField'
import ActivityContentDetails from './ActivityContentDetails'
import styles from './ActivityDetails.module.css'

interface ActivityContentProps {
  event: ActivityEvent
}

const ActivityContentDetailsEncounter: React.FC<ActivityContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const relatedVessel = event.encounter?.vessel as EventVessel
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [profileLoading, setProfileLoading] = useState(false)

  return (
    <Fragment>
      {relatedVessel && (
        <div className={styles.row}>
          <ActivityContentField
            label={t('vessel.encounteredVessel', 'Encountered Vessel')}
            value={
              <span>
                {relatedVessel.name}{' '}
                {profileLoading && <Spinner size="tiny" className={styles.profileLoader}></Spinner>}
              </span>
            }
          />
          <ActivityContentField label={t('vessel.flag', 'Flag')} value={relatedVessel.flag} />
        </div>
      )}

      <ActivityContentDetails event={event} />

      {event.encounter && (
        <Fragment>
          {event.encounter.mainVesselAuthorizationStatus && (
            <ActivityContentField
              label={t('events.vesselAuthorization', 'Vessel Authorization')}
              value={
                <span className={styles.authorizationStatuses}>
                  <AuthIcon authorizationStatus={'false'} />
                  {event.encounter.mainVesselAuthorizationStatus}
                </span>
              }
            />
          )}
          {event.encounter.encounteredVesselAuthorizationStatus && (
            <ActivityContentField
              label={t('events.encounteredVesselAuthorization', 'Encountered Vessel Authorization')}
              value={
                <span className={styles.authorizationStatuses}>
                  <AuthIcon authorizationStatus={'false'} />
                  {event.encounter.encounteredVesselAuthorizationStatus}
                </span>
              }
            />
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default ActivityContentDetailsEncounter

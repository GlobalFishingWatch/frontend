import React, { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { EventVessel } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import AuthIcon from 'features/vessel/auth-icon/AuthIcon'
import ActivityModalContentField from './ActivityModalContentField'
import ActivityModalContentDetails from './ActivityModalContentDetails'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContentDetailsEncounter: React.FC<ActivityModalContentProps> = (
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
          <ActivityModalContentField
            label={t('vessel.encounteredVessel', 'Encountered Vessel')}
            value={
              <span>
                {relatedVessel.name}{' '}
                {profileLoading && <Spinner size="tiny" className={styles.profileLoader}></Spinner>}
              </span>
            }
          />
          <ActivityModalContentField label={t('vessel.flag', 'Flag')} value={relatedVessel.flag} />
        </div>
      )}

      <ActivityModalContentDetails event={event} />

      {event.encounter && (
        <Fragment>
          {event.encounter.mainVesselAuthorizationStatus && (
            <ActivityModalContentField
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
            <ActivityModalContentField
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

export default ActivityModalContentDetailsEncounter

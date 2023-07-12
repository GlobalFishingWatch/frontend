import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { EventVessel } from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import AuthIcon from './AuthIcon'
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

  return (
    <Fragment>
      {relatedVessel && (
        <div className={styles.row}>
          <ActivityContentField
            label={t('vessel.encounteredVessel', 'Encountered Vessel')}
            value={<span>{relatedVessel.name} </span>}
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

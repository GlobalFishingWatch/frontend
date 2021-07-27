import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { EventVessel } from '@globalfishingwatch/api-types/dist'
import { ActivityEvent } from 'types/activity'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContentDetailsEncounter: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const relatedVessel = event.encounter?.vessel as EventVessel
  const { t } = useTranslation()

  return (
    <Fragment>
      {event.encounter && <p>
        <span>{t('event.medianSpeed', 'Median Speed')}:</span>
        {event.encounter.medianSpeedKnots.toFixed(2)}knots
        </p>
      }
      {event.encounter && <p><span>{t('event.authStatus', 'Authorization status')}:</span> {event.encounter.authorizationStatus}</p>}
      {relatedVessel &&
        <div>
          <h3>{t('event.vesselInvolved', 'Vessel involved in the event')}:</h3>
          <p><span>{t('vessel.name', 'Name')}:</span> {relatedVessel.name}</p>
          <p><span>{t('vessel.flag', 'Flag')}:</span> {relatedVessel.flag}</p>
          <p><span>{t('event.nextPort', 'Next port traveled')}:</span> {relatedVessel.nextPort?.label}</p>
        </div>
      }
    </Fragment>
  )
}

export default ActivityModalContentDetailsEncounter

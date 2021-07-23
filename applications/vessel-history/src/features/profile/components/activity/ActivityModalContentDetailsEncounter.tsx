import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityEvent } from 'types/activity'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContentDetailsEncounter: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  return (
    <Fragment>
      {event.encounter && <p>
        <span>{t('event.medianSpeed', 'Median Speed')}:</span>
        {event.encounter.medianSpeedKnots.toFixed(2)}knots
        </p>
      }
      {event.encounter && <p><span>{t('event.authStatus', 'Authorization status')}:</span> {event.encounter.authorizationStatus}</p>}
      {event.encounter &&
        <div>
          <h3>{t('event.vesselInvolved', 'Vessel involved in the event')}:</h3>
          <p><span>{t('vessel.name', 'Name')}:</span> {event.encounter.vessel.name}</p>
          <p><span>{t('vessel.flag', 'Flag')}:</span> {event.encounter.vessel.name}</p>
          <p><span>{t('event.nextPort', 'Next port traveled')}:</span> {event.encounter.vessel.nextPort?.label}</p>
        </div>
      }
    </Fragment>
  )
}

export default ActivityModalContentDetailsEncounter

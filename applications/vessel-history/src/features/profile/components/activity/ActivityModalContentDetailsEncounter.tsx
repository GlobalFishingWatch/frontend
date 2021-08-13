import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { EventVessel } from '@globalfishingwatch/api-types/dist'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import ActivityModalContentField from './ActivityModalContentField'
import ActivityModalContentDetails from './ActivityModalContentDetails'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContentDetailsEncounter: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const relatedVessel = event.encounter?.vessel as EventVessel
  const { t } = useTranslation()

  return (
    <Fragment>
      {relatedVessel && (
        <div className={styles.row}>
          <ActivityModalContentField
            label={t('vessel.encounteredVessel', 'Encountered Vessel')}
            value={relatedVessel.name}
          />
          <ActivityModalContentField label={t('vessel.flag', 'Flag')} value={relatedVessel.flag} />
          <ActivityModalContentField
            label={t('event.nextPort', 'Next port traveled')}
            value={relatedVessel.nextPort?.label}
          />
        </div>
      )}

      <ActivityModalContentDetails event={event} />

      {event.encounter && (
        <ActivityModalContentField
          label={t('event.medianSpeed', 'Median Speed')}
          value={
            event.encounter.medianSpeedKnots
              ? t('event.formatSpeedKnots', '{{value}} knots', {
                  value: event.encounter.medianSpeedKnots.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
      )}
      {event.encounter && (
        <ActivityModalContentField
          label={t('event.authStatus', 'Authorization status')}
          value={event.encounter.authorizationStatus}
        />
      )}
    </Fragment>
  )
}

export default ActivityModalContentDetailsEncounter

import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { EncounterEvent } from '@globalfishingwatch/api-types/dist'

interface ActivityDescriptionProps {
  encounter: EncounterEvent
  type: 'group' | 'event'
  ocean?: string
  count?: number
}

const ActivityDescriptionEncounter: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const encounter = props.encounter
  const { t } = useTranslation()

 
  if (props.type === 'group' ) {
    return (
      <Fragment>
        {t('event.encounterDetails', '{{ type }} authorization encounter with {{ vessel }}', { 
          type: encounter.authorizationStatus,
          vessel: encounter.vessel.name
        })}
      </Fragment>
    )
  }

  if (props.type === 'event') {
    return (
      <Fragment>
        {t('event.encounterDetails', '{{ type }} authorization encounter with {{ vessel }}', { 
          type: encounter.authorizationStatus,
          vessel: encounter.vessel.name
        })}
      </Fragment>
    )
  }

  return (
    <Fragment>{t('event.noDescription', 'No description found')}</Fragment>
  )
}

export default ActivityDescriptionEncounter

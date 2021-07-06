import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityEventType } from 'types/activity'
import ActivityDescriptionEEZ from './ActivityDescriptionEEZ'
import ActivityDescriptionEncounter from './ActivityDescriptionEncounter'
import ActivityDescriptionRFMO from './ActivityDescriptionRFMO'

interface ActivityDescriptionProps {
  event: ActivityEventType | null
}

const ActivityDescription: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  if (event?.encounter) {
    return <ActivityDescriptionEncounter encounter={event.encounter} type="event"></ActivityDescriptionEncounter>
  }
  if (event?.regions.eez[0]){
    return <ActivityDescriptionEEZ regionId={event.regions.eez[0]} type="event" ocean={event.regions.ocean[0]}></ActivityDescriptionEEZ>
  }
  if (event?.regions.rfmo[0]){
    return <ActivityDescriptionRFMO regionId={event.regions.rfmo[0]} type="event" ocean={event.regions.ocean[0]}></ActivityDescriptionRFMO>
  }
  return (
    <Fragment>{t('event.noDescription', 'No description found')}</Fragment>
  )
}

export default ActivityDescription

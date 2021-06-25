import React, { Fragment } from 'react'
import { ActivityEvent, ActivityEventGroup } from 'types/activity'
import ActivityDescriptionEEZ from './ActivityDescriptionEEZ'

interface ActivityDescriptionProps {
  event?: ActivityEvent
  group?: ActivityEventGroup
}

const ActivityDescription: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const event = props.event
  const group = props.group

  if (group?.event_eez){
    return <ActivityDescriptionEEZ regionId={group?.event_eez} type="group"></ActivityDescriptionEEZ>
  }

  if (event?.regions.eez[0]){
    return <ActivityDescriptionEEZ regionId={event.regions.eez[0]} type="event" ocean={event.regions.ocean[0]}></ActivityDescriptionEEZ>
  }

  if (group?.event_rfmo){
    return <ActivityDescriptionEEZ regionId={group?.event_rfmo} type="group"></ActivityDescriptionEEZ>
  }

  if (event?.regions.rfmo[0]){
    return <ActivityDescriptionEEZ regionId={event.regions.rfmo[0]} type="event" ocean={event.regions.ocean[0]}></ActivityDescriptionEEZ>
  }
  return (
    <Fragment></Fragment>
  )
}

export default ActivityDescription

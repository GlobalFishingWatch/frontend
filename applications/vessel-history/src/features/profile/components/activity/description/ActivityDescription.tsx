import React, { Fragment } from 'react'
import { ActivityEvent } from 'types/activity'
import ActivityDescriptionEEZ from './ActivityDescriptionEEZ'
import ActivityDescriptionRFMO from './ActivityDescriptionRFMO'

interface ActivityDescriptionProps {
  event: ActivityEvent
}

const ActivityDescription: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const event = props.event
  
  if (event?.regions.eez[0]){
    return <ActivityDescriptionEEZ regionId={event.regions.eez[0]} type="event" ocean={event.regions.ocean[0]}></ActivityDescriptionEEZ>
  }
  if (event.regions.rfmo[0]){
    return <ActivityDescriptionRFMO regionId={event.regions.rfmo[0]} type="event" ocean={event.regions.ocean[0]}></ActivityDescriptionRFMO>
  }
  return (
    <Fragment>No description found</Fragment>
  )
}

export default ActivityDescription

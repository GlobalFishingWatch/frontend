import React, { Fragment } from 'react'
import { MarineRegionType } from 'features/regions/regions.slice'
import { ActivityEventGroup } from 'types/activity'
import ActivityDescriptionEEZ from './ActivityDescriptionEEZ'
import ActivityDescriptionRFMO from './ActivityDescriptionRFMO'

interface ActivityDescriptionProps {
  group: ActivityEventGroup
}

const ActivityGroupDescription: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const group = props.group

  const eez = group?.event_places.find(place => place.type === MarineRegionType.eez)
  if (eez){
    return <ActivityDescriptionEEZ regionId={eez.id} type="group" ocean={group.ocean}></ActivityDescriptionEEZ>
  }
  const rfmo = group?.event_places.find(place => place.type === MarineRegionType.rfmo)
  if (rfmo){
    return <ActivityDescriptionRFMO regionId={rfmo.id} type="group" ocean={group.ocean}></ActivityDescriptionRFMO>
  }
  return (
    <Fragment>No description found</Fragment>
  )
}

export default ActivityGroupDescription

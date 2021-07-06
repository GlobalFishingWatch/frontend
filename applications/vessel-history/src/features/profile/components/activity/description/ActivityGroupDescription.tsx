import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { MarineRegionType } from 'features/regions/regions.slice'
import { ActivityEventGroup } from 'types/activity'
import ActivityDescriptionEEZ from './ActivityDescriptionEEZ'
import ActivityDescriptionRFMO from './ActivityDescriptionRFMO'
import ActivityDescriptionEncounter from './ActivityDescriptionEncounter'

interface ActivityDescriptionProps {
  group: ActivityEventGroup
}

const ActivityGroupDescription: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const group = props.group
  const { t } = useTranslation()
  const eez = group?.event_places.find(place => place.type === MarineRegionType.eez)
  if (group.encounter) {
    return <ActivityDescriptionEncounter encounter={group.encounter} type="group"></ActivityDescriptionEncounter>
  }
  if (eez){
    return <ActivityDescriptionEEZ regionId={eez.id} count={group?.entries.length} type="group" ocean={group.ocean}></ActivityDescriptionEEZ>
  }
  const rfmo = group?.event_places.find(place => place.type === MarineRegionType.rfmo)
  if (rfmo){
    return <ActivityDescriptionRFMO regionId={rfmo.id} count={group?.entries.length} type="group" ocean={group.ocean}></ActivityDescriptionRFMO>
  }
  return (
    <Fragment>{t('event.noDescription', 'No description found')}</Fragment>
  )
}

export default ActivityGroupDescription

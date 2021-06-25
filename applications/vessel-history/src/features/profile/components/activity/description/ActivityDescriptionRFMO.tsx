import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectRfmoById } from 'features/regions/regions.selectors'
import { RegionId } from 'features/regions/regions.slice'

interface ActivityDescriptionProps {
  regionId: RegionId
  type: 'group' | 'event'
  count?: number
}

const ActivityDescriptionEEZ: React.FC<ActivityDescriptionProps> = (props): React.ReactElement => {
  const regionId = props.regionId
  const { t } = useTranslation()

  const regionName = useSelector(selectRfmoById(regionId))?.label
  if (props.type === 'group' ) {
    return (
      <Fragment>
        {props.count} Fishing events rfmo in {regionName || 'unknown'}
      </Fragment>
    )
  }

  if (props.type === 'event') {
    return (
      <Fragment>
        Fishing in {regionName || 'unknown'}
      </Fragment>
    )
  }

  return (
    <Fragment></Fragment>
  )
}

export default ActivityDescriptionEEZ

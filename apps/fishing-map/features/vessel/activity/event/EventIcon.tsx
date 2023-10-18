import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
import { Icon } from '@globalfishingwatch/ui-components'
import { selectVesselProfileColor } from 'features/dataviews/dataviews.slice'
import styles from './EventIcon.module.css'

interface EventProps {
  type: EventType
}

const ActivityEvent: React.FC<EventProps> = ({ type }): React.ReactElement => {
  const vesselColor = useSelector(selectVesselProfileColor)
  const style = type === EventTypes.Fishing && vesselColor ? { backgroundColor: vesselColor } : {}
  return (
    <div className={cx(styles.icon, styles[type])} style={style}>
      <Icon icon={`event-${type}`} />
    </div>
  )
}

export default ActivityEvent

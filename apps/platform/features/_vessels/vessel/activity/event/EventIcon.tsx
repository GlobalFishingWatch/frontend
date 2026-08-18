import React from 'react'
import cx from 'classnames'

import type { EventType } from '@globalfishingwatch/api-types'
import { Icon } from '@globalfishingwatch/ui-components'

import styles from './EventIcon.module.css'

interface EventProps {
  type: EventType
}

const ActivityEvent: React.FC<EventProps> = ({ type }): React.ReactElement<any> => {
  return (
    <div className={cx(styles.icon, styles[type])}>
      <Icon icon={`event-${type}`} />
    </div>
  )
}

export default ActivityEvent

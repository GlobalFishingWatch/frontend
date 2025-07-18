import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { EventType } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import I18nNumber from 'features/i18n/i18nNumber'
import EventIcon from 'features/vessel/activity/event/EventIcon'

import styles from '../ActivityGroupedList.module.css'

interface ActivityGroupProps {
  eventType: EventType
  onToggleClick?: (type: EventType) => void
  quantity: number
  expanded: boolean
}

const ActivityGroup: React.FC<ActivityGroupProps> = ({
  eventType,
  onToggleClick = () => {},
  quantity,
  expanded,
}): React.ReactElement<any> => {
  const { t } = useTranslation()

  const onToggle = useCallback(() => onToggleClick(eventType), [eventType, onToggleClick])

  return (
    <Fragment>
      <li className={cx(styles.eventGroup, { [styles.open]: expanded })} data-test={`vv-list-${eventType}`}>
        <div className={styles.header} onClick={onToggle}>
          <EventIcon type={eventType} />
          <p className={styles.title}>
            <I18nNumber number={quantity} />{' '}
            {t(`event.${eventType}` as any, eventType, { count: quantity })}
          </p>
          <div className={cx(styles.actions, 'print-hidden')}>
            <IconButton icon={expanded ? 'arrow-top' : 'arrow-down'} size="small"></IconButton>
          </div>
        </div>
      </li>
    </Fragment>
  )
}

export default ActivityGroup

import { Fragment, useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import type { EventType } from '@globalfishingwatch/api-types'
import EventIcon from 'features/vessel/activity/event/EventIcon'
import I18nNumber from 'features/i18n/i18nNumber'
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
}): React.ReactElement => {
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

import { Fragment, useCallback } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { camelCase, upperFirst } from 'lodash'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
import styles from '../ActivityGroup.module.css'

interface ActivityGroupProps {
  eventType: EventType
  onToggleClick?: (type: EventType) => void
  quantity: number
  expanded: boolean
  children: React.ReactNode
}

const ActivityGroup: React.FC<ActivityGroupProps> = ({
  eventType,
  onToggleClick = () => {},
  quantity,
  children,
  expanded,
}): React.ReactElement => {
  const { t } = useTranslation()

  const hasEvents = quantity > 0
  const onToggle = useCallback(
    () => (hasEvents ? onToggleClick(eventType) : {}),
    [eventType, hasEvents, onToggleClick]
  )

  return (
    <Fragment>
      <li className={cx(styles.eventGroup, { [styles.open]: expanded })}>
        <div className={styles.header} onClick={onToggle}>
          <div className={cx(styles.eventIcon, styles[eventType])}>
            <Icon icon={`event-${eventType}`} />
          </div>
          <p className={styles.title}>
            {t(
              `events.byType${upperFirst(camelCase(eventType))}Title` as any,
              `{{count}} ${eventType} events`,
              {
                count: quantity,
              }
            )}
          </p>
          {hasEvents && (
            <div className={styles.actions}>
              <IconButton icon={expanded ? 'arrow-top' : 'arrow-down'} size="small"></IconButton>
            </div>
          )}
        </div>
        {children && <div className={styles.content}>{children}</div>}
      </li>
    </Fragment>
  )
}

export default ActivityGroup

// t('events.byTypeEncounterTitle', '{{count}} encounters')
// t('events.byTypeFishingTitle', '{{count}} fishing hours')
// t('events.byTypeLoiteringTitle', '{{count}} loitering events')
// t('events.byTypePortVisitTitle', '{{count}} port visits')

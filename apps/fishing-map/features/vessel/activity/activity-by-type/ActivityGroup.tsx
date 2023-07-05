import { Fragment, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { camelCase, lowerCase, startCase, upperFirst } from 'lodash'
import { Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
import styles from '../event/Event.module.css'

interface ActivityGroupProps {
  eventType: EventType
  loading: boolean
  onToggleClick?: (type: EventType) => void
  quantity: number
  expanded: boolean
}

const ActivityGroup: React.FC<ActivityGroupProps> = ({
  eventType,
  loading,
  onToggleClick = () => {},
  quantity,
  expanded,
}): React.ReactElement => {
  const { t } = useTranslation()

  const label = useMemo(
    () =>
      loading
        ? t(
            `events.loading${upperFirst(camelCase(eventType))}Events` as any,
            `loading ${lowerCase(startCase(eventType))} events`
          )
        : t(
            `events.byType${upperFirst(camelCase(eventType))}Title` as any,
            `{{count}} ${eventType} events`,
            {
              count: quantity,
            }
          ),
    [eventType, loading, quantity, t]
  )

  const hasEvents = quantity > 0
  const onToggle = useCallback(
    () => (hasEvents ? onToggleClick(eventType) : {}),
    [eventType, hasEvents, onToggleClick]
  )
  return (
    <Fragment>
      <div className={cx(styles.event, styles.eventGroup, { [styles.open]: expanded })}>
        <div className={styles.eventData} onClick={onToggle}>
          <div className={cx(styles.eventIcon, styles[eventType])}>
            {eventType === EventTypes.Encounter && <Icon icon="event-encounter" type="default" />}
            {eventType === EventTypes.Loitering && <Icon icon="event-loitering" type="default" />}
            {eventType === EventTypes.Fishing && <Icon icon="event-fishing" type="default" />}
            {eventType === EventTypes.Port && <Icon icon="event-port-visit" type="default" />}
            {eventType === EventTypes.Gap && <Icon icon="transmissions-off" type="default" />}
          </div>
          {loading && <Spinner className={styles.eventLoading} size={'tiny'} />}
          <div className={styles.description}>{label}</div>
        </div>
        {hasEvents && (
          <div className={styles.actions}>
            <IconButton
              icon={expanded ? 'arrow-top' : 'arrow-down'}
              size="small"
              onClick={onToggle}
            ></IconButton>
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default ActivityGroup

// t('events.byTypeEncounterTitle', '{{count}} encounters')
// t('events.byTypeFishingTitle', '{{count}} fishing hours')
// t('events.byTypeLoiteringTitle', '{{count}} loitering events')
// t('events.byTypePortVisitTitle', '{{count}} port visits')
// t('events.loadingEncounterEvents', 'loading encounters')
// t('events.loadingFishingEvents', 'loading fishing events')
// t('events.loadingLoiteringEvents', 'loading loitering events')
// t('events.loadingPortVisitEvents', 'loading port visits')

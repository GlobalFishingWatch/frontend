import { Fragment, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { camelCase, lowerCase, startCase, upperFirst } from 'lodash'

import type { EventType} from '@globalfishingwatch/api-types';
import { EventTypes } from '@globalfishingwatch/api-types'
import { Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'

import styles from './Activity.module.css'

interface ActivityGroupProps {
  eventType: EventType
  loading: boolean
  onToggleClick?: (type: EventType) => void
  quantity: number
  status: 'expanded' | 'collapsed'
}

const labelByType = {
  [EventTypes.Encounter]: '{{count}} encounters',
  [EventTypes.Fishing]: '{{count}} fishing hours',
  [EventTypes.Loitering]: '{{count}} loitering events',
  [EventTypes.Port]: '{{count}} port visits',
  [EventTypes.Gap]: '{{count}} likely disabling events',
}
const loadingByType = {
  [EventTypes.Encounter]: 'loading encounters',
  [EventTypes.Fishing]: 'loading fishing events',
  [EventTypes.Loitering]: 'loading loitering events',
  [EventTypes.Port]: 'loading port visits',
  [EventTypes.Gap]: 'loading likely disabling events',
}

const ActivityGroup: React.FC<ActivityGroupProps> = ({
  eventType,
  loading,
  onToggleClick = () => {},
  quantity,
  status,
}): React.ReactElement<any> => {
  const { t } = useTranslation()

  const label = useMemo(
    () =>
      loading
        ? t(
            `events.loading${upperFirst(camelCase(eventType))}Events` as any,
            loadingByType[eventType] ?? `loading ${lowerCase(startCase(eventType))} events`
          )
        : t(
            `events.byType${upperFirst(camelCase(eventType))}Title` as any,
            labelByType[eventType] ?? `{{count}} ${eventType} events`,
            {
              count: quantity,
            }
          ),
    [eventType, loading, quantity, t]
  )

  const hasEvents = useMemo(() => quantity > 0, [quantity])
  const onToggle = useCallback(
    () => (hasEvents ? onToggleClick(eventType) : {}),
    [eventType, hasEvents, onToggleClick]
  )
  return (
    <Fragment>
      <div
        className={cx(styles.event, styles.eventGroup, { [styles.open]: status === 'expanded' })}
      >
        <div className={styles.eventData} onClick={onToggle}>
          <div className={cx(styles.eventIcon, styles[eventType])}>
            {eventType === EventTypes.Encounter && <Icon icon="event-encounter" type="default" />}
            {eventType === EventTypes.Loitering && <Icon icon="event-loitering" type="default" />}
            {eventType === EventTypes.Fishing && <Icon icon="event-fishing" type="default" />}
            {eventType === EventTypes.Port && <Icon icon="event-port_visit" type="default" />}
            {eventType === EventTypes.Gap && <Icon icon="event-gap" type="default" />}
          </div>
          {loading && <Spinner className={styles.eventLoading} size={'tiny'} />}
          <div className={styles.description}>{label}</div>
        </div>
        {hasEvents && (
          <div className={styles.actions}>
            <IconButton
              icon={status === 'expanded' ? 'arrow-top' : 'arrow-down'}
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

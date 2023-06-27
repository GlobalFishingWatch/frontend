import { groupBy } from 'lodash'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Icon, IconType } from '@globalfishingwatch/ui-components'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/vessel.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import styles from './VesselActivitySummary.module.css'

export const VesselActivitySummary = () => {
  const { t } = useTranslation()
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const eventsByType = useMemo(() => {
    if (!events?.length) return {}
    return groupBy(events, 'type')
  }, [events])

  return (
    <ul>
      {Object.entries(eventsByType).map(([eventType, events]) => (
        <li key={eventType} className={styles.eventsCount}>
          <div className={styles.iconContainer}>
            <Icon icon={`event-legend-${eventType}` as IconType} type="original-colors" />
          </div>
          <strong>{formatI18nNumber(events.length)}</strong>
          {t(`event.${eventType}` as any, {
            defaultValue: eventType,
            count: events.length,
          })}
        </li>
      ))}
    </ul>
  )
}

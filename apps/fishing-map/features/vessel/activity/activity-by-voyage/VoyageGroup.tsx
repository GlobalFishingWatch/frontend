import { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { IconButton } from '@globalfishingwatch/ui-components'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { RenderedVoyage } from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.selectors'
import styles from '../ActivityGroup.module.css'

interface EventProps {
  event: RenderedVoyage
  expanded: boolean
  children: React.ReactNode
  onMapClick?: (event: RenderedVoyage) => void
  onMapHover?: (event?: RenderedVoyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
}

const VoyageGroup: React.FC<EventProps> = ({
  event,
  children,
  expanded = false,
  onMapClick = () => {},
  onMapHover = () => {},
  onToggleClick = () => {},
}): React.ReactElement => {
  const { t } = useTranslation()
  const voyageLabel = useMemo(() => {
    const parts: string[] = []
    if (event.from && event.to) {
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(event.start ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
      parts.push(
        `${t('common.to', 'to')} ${formatI18nDate(event.end ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
    } else if (!event.to) {
      parts.push(t('event.currentVoyage' as any, 'Ongoing Voyage') as string)
      parts.push(
        `${t('common.from', 'from')} ${formatI18nDate(event.start ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
    } else {
      parts.push(
        `${t('common.to', 'to')} ${formatI18nDate(event.end ?? 0, {
          format: DateTime.DATE_FULL,
        })}`
      )
    }
    parts.push(`(${event.eventsQuantity} ${t('common.events', 'Events')})`)

    return parts.join(' ')
  }, [event, t])

  const hasEvents = event.eventsQuantity > 0

  const onToggle = useCallback(
    () => (hasEvents ? onToggleClick(event) : {}),
    [hasEvents, onToggleClick, event]
  )

  const onMap = useCallback(
    () => (hasEvents ? onMapClick(event) : {}),
    [hasEvents, onMapClick, event]
  )

  return (
    <li className={cx(styles.eventGroup, { [styles.open]: expanded })}>
      <div className={styles.header} onClick={onToggle}>
        <p className={styles.title}>{voyageLabel}</p>
        {hasEvents && (
          <div className={styles.actions}>
            <IconButton size="small" icon={expanded ? 'arrow-top' : 'arrow-down'} />
            <IconButton
              icon="view-on-map"
              size="small"
              onClick={onMap}
              onMouseEnter={() => onMapHover(event)}
              onMouseLeave={() => onMapHover(undefined)}
            />
          </div>
        )}
      </div>
      {children && <ul className={styles.content}>{children}</ul>}
    </li>
  )
}

export default VoyageGroup
